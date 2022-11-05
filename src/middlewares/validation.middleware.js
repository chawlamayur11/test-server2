import { init, validate } from 'openapi-validator-middleware'
import config from '#config'

init(config.openApiPath, {
  formats: [
    // minimum eight characters, at least one letter and one number
    { name: 'password', pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ },
  ],
})

export default validate
