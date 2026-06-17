import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { CoinsProps, FormattedCoin } from '../home'
import styles from './detail.module.css'




interface ResponseData {
  data: CoinsProps
}

interface ErrorData {
  error: string;

}

type DataProps = ResponseData | ErrorData



export function Detail() {
  const { cripto } = useParams()
  const navigate = useNavigate()

  const [coin, setCoin] = useState<FormattedCoin>()
  const [loading, setLoading] = useState(true)
  const API_KEY = import.meta.env.VITE_COINCAP_API_KEY as string | undefined


  useEffect(() => {
    const controller = new AbortController()
    let ignore = false

    async function getCoin() {
      try {
        setLoading(true)

        if (!cripto) {
          throw new Error('Parâmetro da rota ausente')
        }

        const headers: HeadersInit = {}
        if (API_KEY) {
          headers.Authorization = `Bearer ${API_KEY}`
        }

        const response = await fetch(`https://rest.coincap.io/v3/assets/${cripto}`, {
          headers,
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = (await response.json()) as DataProps

        if ("error" in data) {
          navigate('/')
          return
        }

        const price = Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        })

        const priceCompact = Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: 'compact',
        })

        const resultData = {
          ...data.data,
          formatedPrice: price.format(Number(data.data.priceUsd)),
          formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
        }

        if (ignore) return
        setCoin(resultData)
      } catch (err) {
        if (ignore) return
        setCoin(undefined)
        navigate('/')
      } finally {
        if (ignore) return
        setLoading(false)
      }
    }

    getCoin()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [API_KEY, cripto, navigate])


  if (loading || !coin) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando detalhes...</h4>
      </div>
    )

  }



  return (

    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h1 className={styles.center}>{coin?.symbol}</h1>

      <section className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLocaleLowerCase()}@2x.png`}
          alt="Logo da moeda"
          className={styles.logo}
        />

        <h1>{coin?.name} | {coin?.symbol}</h1>

        <p><strong> Preço:</strong>{coin?.formatedPrice}</p>

        <a>
          <strong>Mercado: </strong>{coin?.formatedVolume}
        </a>
        <a>
          <strong>Mudança 24h: </strong> <span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss}
          > {Number(coin?.changePercent24Hr).toFixed(3)} </span>
        </a>
        <a>
          <strong>Mercado: </strong>{coin?.formatedVolume}
        </a>
      </section>


    </div>


  )
}
