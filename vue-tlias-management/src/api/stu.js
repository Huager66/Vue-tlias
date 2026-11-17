import request from '@/utils/request'

export const queryPageApi = (name, degree, clazzId, page, pageSize) =>
  request.get(
    `/students?name=${name}&degree=${degree}&clazzId=${clazzId}&page=${page}&pageSize=${pageSize}`,
  )

export const addApi = (stu) => request.post('/students', stu)

export const queryByIdApi = (id) => request.get(`/students/${id}`)

export const updateApi = (stu) => request.put('/students', stu)

export const deleteByIdApi = (id) => request.delete(`/students/${id}`)
export const violationApi = (stu) => request.put('/students', stu)
