'use strict';

/**
 * Règle custom qui étend react-hooks/rules-of-hooks en permettant
 * le pattern d’optimisation RN web : early return sur Platform.OS avant les hooks.
 * La condition Platform.OS ne change pas au runtime.
 *
 * Patterns autorisés :
 * - if (Platform.OS === 'web') return; useEffect(...)
 * - if (Platform.OS !== 'web') { useEffect(...) }
 */

const HOOK_NAME_RE = /^use[A-Z0-9]/;

function isHookName(name) {
  return name === 'use' || HOOK_NAME_RE.test(name);
}

function isHook(node) {
  if (!node) return false;
  if (node.type === 'Identifier') {
    return isHookName(node.name);
  }
  if (
    node.type === 'MemberExpression' &&
    !node.computed &&
    isHook(node.property)
  ) {
    const obj = node.object;
    return obj.type === 'Identifier' && /^[A-Z]/.test(obj.name);
  }
  return false;
}

function isComponentOrHookName(node) {
  if (!node || node.type !== 'Identifier') return false;
  const name = node.name;
  return /^[A-Z]/.test(name) || isHookName(name);
}

function getFunctionNode(hookCall) {
  let parent = hookCall.parent;
  while (parent) {
    if (
      parent.type === 'FunctionDeclaration' ||
      parent.type === 'FunctionExpression' ||
      parent.type === 'ArrowFunctionExpression'
    ) {
      return parent;
    }
    parent = parent.parent;
  }
  return null;
}

function getFunctionName(node) {
  if (!node) return null;
  if (node.type === 'FunctionDeclaration' && node.id) return node.id;
  if (node.type === 'FunctionExpression' && node.id) return node.id;
  if (node.type === 'ArrowFunctionExpression' && node.parent?.type === 'VariableDeclarator' && node.parent.id) {
    return node.parent.id;
  }
  return null;
}

/** Vérifie que l’expression est bien Platform.OS === 'web' ou !== 'web' */
function isPlatformOSWebCheck(node) {
  if (node?.type !== 'BinaryExpression' || !['===', '!=='].includes(node.operator)) return false;
  const { left, right } = node;
  const member = left?.type === 'MemberExpression' ? left : right?.type === 'MemberExpression' ? right : null;
  const literal = left?.type === 'Literal' ? left : right?.type === 'Literal' ? right : null;
  if (!member || !literal || literal.value !== 'web') return false;
  return (
    member.object?.type === 'Identifier' &&
    member.object.name === 'Platform' &&
    member.property?.type === 'Identifier' &&
    member.property.name === 'OS'
  );
}

/** Premier statement du corps est if (Platform.OS === 'web') return */
function isPlatformOSEarlyReturn(statement) {
  if (statement?.type !== 'IfStatement') return false;
  if (!isPlatformOSWebCheck(statement.test)) return false;
  if (statement.consequent?.type === 'ReturnStatement') return true;
  if (statement.consequent?.type === 'BlockStatement' && statement.consequent.body?.length === 1) {
    return statement.consequent.body[0]?.type === 'ReturnStatement';
  }
  return false;
}

/** Le bloc est le consequent de if (Platform.OS !== 'web') */
function isInsidePlatformOSNotWebBlock(node) {
  let current = node;
  while (current) {
    if (current.type === 'BlockStatement' && current.parent?.type === 'IfStatement') {
      const ifStmt = current.parent;
      if (ifStmt.consequent === current && isPlatformOSWebCheck(ifStmt.test) && ifStmt.test?.operator === '!==') {
        return true;
      }
    }
    current = current.parent;
  }
  return false;
}

/** Remonte depuis le nœud pour trouver le statement direct du corps (BlockStatement) */
function getStatementIndexInBody(node, body) {
  if (!body?.body?.length) return -1;
  let current = node;
  while (current && current !== body) {
    if (current.parent === body && Array.isArray(body.body)) {
      const idx = body.body.indexOf(current);
      if (idx !== -1) return idx;
    }
    current = current.parent;
  }
  return -1;
}

/** Le hook est au top-level du corps, juste après if (Platform.OS === 'web') return */
function isHookAfterPlatformOSEarlyReturn(hookCall, functionNode) {
  const body = functionNode.body?.type === 'BlockStatement' ? functionNode.body : null;
  if (!body || !body.body?.length) return false;

  const hookIndex = getStatementIndexInBody(hookCall, body);
  if (hookIndex <= 0) return false;
  return isPlatformOSEarlyReturn(body.body[hookIndex - 1]);
}

/** Le hook est dans un chemin conditionnel (if/else/loop) qui n’est pas le garde Platform.OS */
function isInConditionalPath(hookCall, functionNode) {
  const body = functionNode.body?.type === 'BlockStatement' ? functionNode.body : null;
  if (!body) return false;

  if (isHookAfterPlatformOSEarlyReturn(hookCall, functionNode)) return false;
  if (isInsidePlatformOSNotWebBlock(hookCall)) return false;

  let node = hookCall;
  while (node && node !== body) {
    const parent = node.parent;
    if (!parent) break;
    if (parent === functionNode) break;
    if (parent.type === 'IfStatement' || parent.type === 'ConditionalExpression') return true;
    if (parent.type === 'ForStatement' || parent.type === 'ForInStatement' || parent.type === 'ForOfStatement') return true;
    if (parent.type === 'WhileStatement' || parent.type === 'DoWhileStatement') return true;
    node = parent;
  }
  return false;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforces Rules of Hooks but allows Platform.OS guard (RN web optimization)',
      recommended: true,
    },
    schema: [],
    messages: {
      conditionalHook:
        'React Hook "{{name}}" is called conditionally. React Hooks must be called in the exact same order in every component render.',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode?.() ?? context.sourceCode;

    return {
      CallExpression(node) {
        const callee = node.callee;
        const hookIdentifier =
          callee.type === 'MemberExpression' && callee.object?.name === 'React'
            ? callee.property
            : callee;
        if (!isHook(hookIdentifier)) return;

        const functionNode = getFunctionNode(node);
        if (!functionNode) return;

        const nameNode = getFunctionName(functionNode);
        if (!nameNode || !isComponentOrHookName(nameNode)) return;

        if (functionNode.async) {
          context.report({
            node: hookIdentifier,
            message: `React Hook "${sourceCode.getText(hookIdentifier)}" cannot be called in an async function.`,
          });
          return;
        }

        if (isInConditionalPath(node, functionNode)) {
          context.report({
            node: hookIdentifier,
            messageId: 'conditionalHook',
            data: { name: sourceCode.getText(hookIdentifier) },
          });
        }
      },
    };
  },
};
