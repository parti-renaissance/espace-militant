import { CSSProperties } from 'react'
import { stringifyCSSProperties } from 'react-style-stringify'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { RestAvailableSendersResponse } from '@/services/publications/schema'

const renderSenderView = (sender: RestAvailableSendersResponse[number] | null | undefined, _datetime?: string) => {
  if (!sender) {
    return ''
  }

  const containerStyle: CSSProperties = {
    display: 'block',
    // width: '100%',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '24px',
    paddingBottom: '16px',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
  }

  const instanceBadgeStyle: CSSProperties = {
    display: 'block',
    backgroundColor: sender.theme?.soft || '#f5f5f5',
    borderRadius: '20px',
    padding: '0px 8px',
    maxWidth: 'fit-content',
    marginBottom: '12px',
  }

  const instanceTextStyle: CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: sender.theme?.primary || '#6b7280',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.2',
    verticalAlign: 'middle',
  }

  const profileSectionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  }

  const profilePictureStyle: CSSProperties = {
    width: '40px', // $4
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
    marginTop: '0px !important',
    marginBottom: '0px !important',
    marginRight: '8px !important',
  }

  const profileTextStyle: CSSProperties = {
    display: 'block',
  }

  const nameStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#000000',
    margin: '0px',
    lineHeight: '1.2',
  }

  const roleStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: sender.theme?.primary || '#6b7280',
    margin: '0px',
    lineHeight: '1.2',
  }

  const senderName = sender ? `${sender.first_name} ${sender.last_name}` : 'Expéditeur inconnu'
  const instanceText = sender?.instance ?? 'Instance inconnue'
  const zoneText = sender?.zone ? ` • ${sender.zone}` : ''

  return `
    <div class="padding-responsive padding-responsive-top" style="${stringifyCSSProperties(containerStyle)}">
      <div style="${stringifyCSSProperties(instanceBadgeStyle)}">
        <span style="${stringifyCSSProperties(instanceTextStyle)}">
          ${' '}${instanceText}${zoneText}${' '}
        </span>
      </div>
      <div style="${stringifyCSSProperties(profileSectionStyle)}">
        ${sender.image_url ? `
          <img 
            src="${sender.image_url}" 
            alt="Photo de profil" 
            style="${stringifyCSSProperties(profilePictureStyle)}"
            onerror="this.style.display='none'"
          />
        ` : `
          <div style="${stringifyCSSProperties(profilePictureStyle)}; background-color: #e5e7eb; display: flex; align-items: center; justify-content: center; color: #6b7280; font-weight: 600; font-size: 14px;">
            ${senderName.charAt(0).toUpperCase()}
          </div>
        `}
        <div style="${stringifyCSSProperties(profileTextStyle)}">
          <p style="${stringifyCSSProperties(nameStyle)}">${senderName}</p>
          ${sender.role ? `<p style="${stringifyCSSProperties(roleStyle)}">${sender.role}</p>` : ''}
        </div>
      </div>
    </div>
  `
}

export const containerRenderer = (props: { 
  content: string; 
  theme: S.MessageStyle;
  sender?: RestAvailableSendersResponse[number] | null;
  subject?: string;
}) => {
  const senderViewHtml = renderSenderView(props.sender)
  
  return (
    `<div>
      ${senderViewHtml}
      ${props.subject ? `<h1 class="padding-responsive" style="font-size: 18px; font-style: normal !important; font-weight: 600 !important; margin-top: 0px; padding-bottom: 24px !important; background-color: #FFFFFF; padding-left: 16px; padding-right: 16px; line-height: 1.6;">${props.subject}</h1>` : ''}
      ${props.content}
    </div>`
  )
}
