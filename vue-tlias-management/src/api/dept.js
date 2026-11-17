import request from '@/utils/request'

export const queryAllApi = () => request.get('/depts')

export const addApi = (dept) => request.post('/depts', dept)

export const queryByIdApi = (id) => request.get(`/depts/${id}`)

export const updateApi = (dept) => request.put('/depts', dept)

export const deleteByIdApi = (id) => request.delete(`/depts?id=${id}`)
