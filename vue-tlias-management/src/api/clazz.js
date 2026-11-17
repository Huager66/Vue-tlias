import request from '@/utils/request'

export const queryAllApi1 = () => request.get('/clazzs/list')
export const queryAllApi = (name, begin, end, page, pageSize) =>
  request.get(`/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)

export const addApi = (clazz) => request.post('/clazzs', clazz)

export const queryByIdApi = (id) => request.get(`/clazzs/${id}`)

export const updateApi = (clazz) => request.put('/clazzs', clazz)

export const deleteByIdApi = (id) => request.delete(`/clazzs/${id}`)
