// Preloader.js
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

type TPreloaderProps = {
  close: boolean
}

const Preloader = (props: TPreloaderProps) => {
  const { close } = props
  const [progress, setProgress] = useState(0)
  const [counter, setCounter] = useState(0)
  const [closing, setClosing] = useState<boolean>(false)

  useEffect(() => {
    const duration = 20000
    const startTime = Date.now()

    const updateProgress = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      const newProgress = (elapsedTime / duration) * 100

      if (newProgress < 100) {
        // Only update counter when progress is not complete
        setCounter(Math.floor(newProgress))
      }

      setProgress(newProgress)

      if (elapsedTime < duration && !closing) {
        requestAnimationFrame(updateProgress)
      } else {
        if (close) {
          setClosing(true)
        }
      }
    }

    const animationFrame = requestAnimationFrame(updateProgress)

    return () => {
      cancelAnimationFrame(animationFrame) // Clean up animation frame on unmount
    }
  }, [close, closing])
  const gradientOffset = 625 - (625 * counter) / 100

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: '99999',
        background: '#000000b5',
        top: '0',
        left: '0',
        opacity: closing ? 0 : 1,
        pointerEvents: closing ? 'none' : 'auto',
        transition: 'opacity 0.5s ease',
        '& .loader': {
          display: 'block',
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '160px',
          height: '160px',
          margin: '-75px 0 0 -75px',
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#9370DB',
          WebkitAnimation: 'spin 2s linear infinite',
          animation: 'spin 2s linear infinite',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: '5px',
            left: '5px',
            right: '5px',
            bottom: '5px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#BA55D3',
            WebkitAnimation: 'spin 3s linear infinite',
            animation: 'spin 3s linear infinite'
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            top: '15px',
            left: '15px',
            right: '15px',
            bottom: '15px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#FF00FF',
            WebkitAnimation: 'spin 1.5s linear infinite',
            animation: 'spin 1.5s linear infinite'
          }
        },
        '& .percent': {
          position: 'relative'
        },

        // '& svg': {
        //   position: 'relative',
        //   width: '210px',
        //   height: '210px',
        //   transform: 'rotate(-90deg)'
        // },
        // '& circle': {
        //   width: '100%',
        //   height: '100%',
        //   fill: 'none',
        //   stroke: '#f0f0f0',
        //   strokeWidth: '10',
        //   strokeLinecap: 'round',

        //   '&:last-of-type': {
        //     strokeDasharray: '625px',
        //     strokeDashoffset: `calc(625px - ${gradientOffset})`,
        //     animation: 'strokeAnimation 5s linear forwards'
        //   }
        // },
        '& .number': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: '600',
          fontSize: '2.5rem',
          '& h3': {
            color: '#d400ff',
            '& span': {
              fontSize: '1.5rem'
            }
          }
        }
      }}
    >
      <Box>
        <div className='loader'></div>
        <div className='percent'>
          <div className='number'>
            <h3>
              {counter}
              <span>%</span>
            </h3>
          </div>

          {/* <svg>
            <circle cx='105' cy='105' r='100'></circle>
            <circle cx='105' cy='105' r='100'></circle>
          </svg> */}
        </div>
        <div className='preloader-loading-text'>
          <div id='loadingText1' className='loading-text'>
            L
          </div>
          <div id='loadingText2' className='loading-text'>
            o
          </div>
          <div id='loadingText3' className='loading-text'>
            a
          </div>
          <div id='loadingText4' className='loading-text'>
            d
          </div>
          <div id='loadingText5' className='loading-text'>
            i
          </div>
          <div id='loadingText6' className='loading-text'>
            n
          </div>
          <div id='loadingText7' className='loading-text'>
            g
          </div>
        </div>
      </Box>
    </Box>
  )
}

export default Preloader
