import SvgIcon from '@mui/material/SvgIcon'
import * as React from 'react'

interface ChallengerLogoProps {
  width?: number
  height?: number
}

export const ChallengerLogo = ({ width = 120, height = 21 }: ChallengerLogoProps) => {
  return (
    <SvgIcon sx={{ width, height }}>
      <svg viewBox={`0 0 120 21`} xmlns='http://www.w3.org/2000/svg'>
        <path
          fill='#B4C0D3'
          d='m.787 12.567 6.055-2.675 3.485 2.006.704 6.583-4.295-.035.634-4.577-.74-.422-3.625 2.817-2.218-3.697Z'
        />
        <path
          fill='#00D3AB'
          d='m10.714 11.616 5.352 3.908 2.112-3.767-4.295-1.725v-.845l4.295-1.76-2.112-3.732-5.352 3.908v4.013Z'
        />
        <path
          fill='#4876EF'
          d='m10.327 7.286.704-6.583-4.295.07.634 4.577-.74.422-3.66-2.816L.786 6.617l6.055 2.676 3.485-2.007Z'
        />
        <text
          style={{
            fill: '#4876EF',
            fontFamily: 'Tahoma',
            fontSize: '14px',
            fontWeight: '700',
            whiteSpace: 'pre',
          }}
          x='21'
          y='15'
        >
          F1 Challenger
        </text>
      </svg>
    </SvgIcon>
  )
}
