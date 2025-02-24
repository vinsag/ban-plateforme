import 'dotenv/config.js' // eslint-disable-line import/no-unassigned-import
import {customAlphabet} from 'nanoid'
import express from 'express'
import queue from '../../util/queue.cjs'
import auth from '../../middleware/auth.js'
import analyticsMiddleware from '../../middleware/analytics.js'
import {getDistrict, getDistrictsFromCog, deleteDistrict} from './models.js'

const apiQueue = queue('api')

const BAN_API_URL
  = process.env.BAN_API_URL || 'https://plateforme.adresse.data.gouv.fr/api'

const nanoid = customAlphabet('123456789ABCDEFGHJKMNPQRSTVWXYZ', 9)

const app = new express.Router()

app.route('/')
  .post(auth, analyticsMiddleware, async (req, res) => {
    let response
    try {
      const districts = req.body
      const statusID = nanoid()

      await apiQueue.add(
        {dataType: 'district', jobType: 'insert', data: districts, statusID},
        {jobId: statusID, removeOnComplete: true}
      )
      response = {
        date: new Date(),
        status: 'success',
        message: `Check the status of your request : ${BAN_API_URL}/job-status/${statusID}`,
        response: {statusID},
      }
    } catch (error) {
      response = {
        date: new Date(),
        status: 'error',
        message: error,
        response: {},
      }
    }

    res.send(response)
  })
  .put(auth, analyticsMiddleware, async (req, res) => {
    let response
    try {
      const districts = req.body
      const statusID = nanoid()

      await apiQueue.add(
        {dataType: 'district', jobType: 'update', data: districts, statusID},
        {jobId: statusID, removeOnComplete: true}
      )
      response = {
        date: new Date(),
        status: 'success',
        message: `Check the status of your request : ${BAN_API_URL}/job-status/${statusID}`,
        response: {statusID},
      }
    } catch (error) {
      response = {
        date: new Date(),
        status: 'error',
        message: error,
        response: {},
      }
    }

    res.send(response)
  })
  .patch(auth, analyticsMiddleware, async (req, res) => {
    let response
    try {
      const districts = req.body
      const statusID = nanoid()

      await apiQueue.add(
        {dataType: 'district', jobType: 'patch', data: districts, statusID},
        {jobId: statusID, removeOnComplete: true}
      )
      response = {
        date: new Date(),
        status: 'success',
        message: `Check the status of your request : ${BAN_API_URL}/job-status/${statusID}`,
        response: {statusID},
      }
    } catch (error) {
      response = {
        date: new Date(),
        status: 'error',
        message: error,
        response: {},
      }
    }

    res.send(response)
  })

app.route('/:districtID')
  .get(analyticsMiddleware, async (req, res) => {
    let response
    try {
      const {districtID} = req.params
      const district = await getDistrict(districtID)

      if (!district) {
        res.status(404).send('Request ID unknown')
        return
      }

      response = {
        date: new Date(),
        status: 'success',
        response: district,
      }
    } catch (error) {
      const {message} = error
      response = {
        date: new Date(),
        status: 'error',
        message,
        response: {},
      }
    }

    res.send(response)
  })
  .delete(auth, analyticsMiddleware, async (req, res) => {
    let response
    try {
      const {districtID} = req.params
      const district = await getDistrict(districtID)

      if (!district) {
        res.status(404).send('Request ID unknown')
        return
      }

      await deleteDistrict(districtID)
      response = {
        date: new Date(),
        status: 'success',
        response: {},
      }
    } catch (error) {
      const {message} = error
      response = {
        date: new Date(),
        status: 'error',
        message,
        response: {},
      }
    }

    res.send(response)
  })

app.post('/delete', auth, analyticsMiddleware, async (req, res) => {
  let response
  try {
    const districtIDs = req.body
    const statusID = nanoid()

    await apiQueue.add(
      {dataType: 'district', jobType: 'delete', data: districtIDs, statusID},
      {jobId: statusID, removeOnComplete: true}
    )
    response = {
      date: new Date(),
      status: 'success',
      message: `Check the status of your request : ${BAN_API_URL}/job-status/${statusID}`,
      response: {statusID},
    }
  } catch (error) {
    response = {
      date: new Date(),
      status: 'error',
      message: error,
      response: {},
    }
  }

  res.send(response)
})

app.get('/cog/:cog', analyticsMiddleware, async (req, res) => {
  let response
  try {
    const {cog} = req.params
    const districts = await getDistrictsFromCog(cog)

    if (!districts || districts.length === 0) {
      res.status(404).send('Request ID unknown')
      return
    }

    const districtBodies = districts.map(({_id, ...districtBody}) => districtBody)
    response = {
      date: new Date(),
      status: 'success',
      response: districtBodies,
    }
  } catch (error) {
    const {message} = error
    response = {
      date: new Date(),
      status: 'error',
      message,
      response: {},
    }
  }

  res.send(response)
})

export default app
