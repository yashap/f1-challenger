import { JSX } from 'react'
import * as reactRouter from 'react-router'
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui'
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui'
import { getSuperTokensRoutesForReactRouterDom } from 'supertokens-auth-react/ui'

export const buildAuthRoutes = (): JSX.Element[] => {
  const routes = getSuperTokensRoutesForReactRouterDom(reactRouter, [ThirdPartyPreBuiltUI, EmailPasswordPreBuiltUI])
  return routes as JSX.Element[]
}
