import SuperTokens from 'supertokens-auth-react'
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword'
import Session from 'supertokens-auth-react/recipe/session'
import ThirdParty, { Google, Apple } from 'supertokens-auth-react/recipe/thirdparty'

export const initAuth = (): void => {
  SuperTokens.init({
    appInfo: {
      // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
      appName: 'F1 Challenger',
      apiDomain: 'http://localhost:3501',
      websiteDomain: 'http://localhost:1234',
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [Google.init(), Apple.init()],
        },
      }),
      EmailPassword.init(),
      Session.init(),
    ],
    // The URL is an SVG encoded using: https://yoksel.github.io/url-encoder/
    style: `
      [data-supertokens~=superTokensBranding] {
        display: none;
      }
      [data-supertokens~=authPage]::before {
        content: url("data:image/svg+xml,%3Csvg viewBox='0 0 120 21' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23B4C0D3' d='m.787 12.567 6.055-2.675 3.485 2.006.704 6.583-4.295-.035.634-4.577-.74-.422-3.625 2.817-2.218-3.697Z'%0A/%3E%3Cpath fill='%2300D3AB' d='m10.714 11.616 5.352 3.908 2.112-3.767-4.295-1.725v-.845l4.295-1.76-2.112-3.732-5.352 3.908v4.013Z'%0A/%3E%3Cpath fill='%234876EF' d='m10.327 7.286.704-6.583-4.295.07.634 4.577-.74.422-3.66-2.816L.786 6.617l6.055 2.676 3.485-2.007Z'%0A/%3E%3Ctext style='fill: %234876EF; font-family: Tahoma; font-size: 14px, font-weight: 700, white-space: pre;' x='21' y='15'%0A%3E F1 Challenger%0A%3C/text%3E%3C/svg%3E");
        display: block;
        padding-top: 30px;
        width: 210px;
        height: 36px;
        margin: auto;
      }
    `,
  })
}
