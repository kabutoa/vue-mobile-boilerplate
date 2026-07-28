import { Express } from 'express'
import { readdir } from 'fs/promises'
import Mock from 'mockjs'
import path, { dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import type { IMockData } from '../types'

export const PORT = 3000

export const colors = {
  blue: '\x1b[34m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  white: '\x1b[37m',
  yellow: '\x1b[33m',
}

export const getStatusColor = (status: number): string => {
  if (status >= 500) return colors.red
  if (status >= 400) return colors.yellow
  if (status >= 300) return colors.cyan
  if (status >= 200) return colors.green
  return colors.white
}

export const getMethodColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'DELETE':
      return colors.red
    case 'GET':
      return colors.green
    case 'PATCH':
      return colors.magenta
    case 'POST':
      return colors.yellow
    case 'PUT':
      return colors.blue
    default:
      return colors.white
  }
}

export const formatTimestamp = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes(),
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
}

export const formatSize = (size: number): string => {
  if (size < 1024) return `${size}B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`
  return `${(size / 1024 / 1024).toFixed(1)}MB`
}

export function getResponse(data) {
  const initialResponse = {
    msg: '',
    status: 'success',
  }
  return {
    ...initialResponse,
    data,
  }
}

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

export const getMocks = async (dir = path.resolve(__dirname, '../services')) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const res = path.resolve(dir, entry.name)
      return entry.isDirectory() ? getMocks(res) : import(pathToFileURL(res).href)
    }),
  )
  return files.flat()
}

export const prefixUrl = '/api'

export const registerMock = async (app: Express) => {
  const mocks = await getMocks()
  mocks.forEach((mock) => {
    const {
      data,
      type,
      url,
      usePrefix = true,
      useStandardResponse = true,
    } = mock.default as IMockData
    const requestUrl = `${usePrefix ? prefixUrl : ''}${url}`
    console.log(`Mocked ${type.toUpperCase()} ${requestUrl}`)
    app[type](requestUrl, async (req, res) => {
      // 获取1～3之间的随机数
      // const random = Math.floor(Math.random() * 3) + 1
      const random = Math.floor(Math.random()) + 1
      await new Promise((resolve) => setTimeout(resolve, random * 1000))

      const responseData = typeof data === 'function' ? data(req) : data
      res.json(Mock.mock(useStandardResponse ? getResponse(responseData) : responseData))
    })
  })
}
