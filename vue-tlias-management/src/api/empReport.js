import request from '@/utils/request'

export const queryRepoetApi = () => request.get('/report/empJobData')

export const queryGenRepoetApi = () => request.get('/report/empGenderData')
export const getOperateLogPageApi = (page, pageSize) =>
  request.get(`/report/log/page?page=${page}&pageSize=${pageSize}`)

export const studentCountDataApi = () => request.get('/report/studentCountData')

export const studentDegreeDataApi = () => request.get('/report/studentDegreeData')
