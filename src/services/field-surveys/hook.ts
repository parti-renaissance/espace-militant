import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldSurveysService } from './api'
import { FieldSurvey, FieldSurveyResultRequest } from './schema'

export const FIELD_SURVEYS_QUERY_KEY = 'field-surveys'

// Hook pour récupérer la liste des sondages
export const useFieldSurveys = () => {
  return useQuery({
    queryKey: [FIELD_SURVEYS_QUERY_KEY],
    queryFn: () => FieldSurveysService.getSurveys(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook pour récupérer un sondage spécifique par UUID
export const useFieldSurvey = (surveyUuid: string) => {
  const { data: surveys, ...rest } = useFieldSurveys()
  
  const survey = surveys?.find(s => s.uuid === surveyUuid)
  
  return {
    data: survey,
    ...rest,
  }
}

// Hook pour soumettre les réponses d'un sondage
export const useSubmitFieldSurveyAnswers = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: FieldSurveyResultRequest) => 
      FieldSurveysService.submitSurveyAnswers(data),
    onSuccess: () => {
      // Invalider le cache des sondages après soumission
      queryClient.invalidateQueries({
        queryKey: [FIELD_SURVEYS_QUERY_KEY],
      })
    },
  })
}

// Hook pour récupérer les sondages avec gestion du cache et refresh
export const useFieldSurveysWithRefresh = () => {
  const queryClient = useQueryClient()
  
  const query = useFieldSurveys()
  
  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: [FIELD_SURVEYS_QUERY_KEY],
    })
  }
  
  return {
    ...query,
    refresh,
  }
}
