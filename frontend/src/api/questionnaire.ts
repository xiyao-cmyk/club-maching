import http from './index'

export const questionnaireApi = {
  getQuestions: () => http.get<any, any>('/questionnaire/questions'),

  getMyAnswers: () => http.get<any, any>('/questionnaire/my-answers'),

  saveAnswers: (answers: Record<number, any>, completed = false) =>
    http.post<any, any>('/questionnaire/answers', { answers, completed }),
}
