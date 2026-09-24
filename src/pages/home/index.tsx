import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'


  export interface CoinsProps {
  id: string
  name: string
  symbol: string
  priceUsd: string
  vwap24Hr: string
  changePercent24Hr: string
  rank: string
  supply: string
  maxSupply: string
  volumeUsd24Hr: string
  explore: string
  marketCapUsd: string
}

export interface FormattedCoin extends CoinsProps {
  formatedPrice: string
  formatedMarket: string
  formatedVolume: string
}

interface DataProps {
  data: CoinsProps[]
}

export function Home() {
  const [input, setInput] = useState('')
  const [coins, setCoins] = useState<FormattedCoin[]>([])
  const [offset, setOffset] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    getData()
  }, [offset])


  async function getData() {
    const response = await fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}`)
    const data = (await response.json()) as DataProps
    const coinsData = data.data
    


    const price = Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })

    const priceCompact = Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    })

    const formattedResult: FormattedCoin[] = coinsData.map((item) => ({
      ...item,
      formatedPrice: price.format(Number(item.priceUsd)),
      formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
      formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
    }



    ))

    const listCoins = [...coins, ...formattedResult]
    setCoins(listCoins)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (input.trim() === '') return

    navigate(`/detail/${input.trim()}`)
  }

  function handleGetMore() {
    if (offset === 0) {
      setOffset(10)
      return
    }
    setOffset(offset + 10)

  }

  return (
    <main className={styles.container}>

    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Digite o nome da moeda ... Ex: bitcoin"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">
        <BsSearch size={30} color="#FFF" />
      </button>
    </form>

    {/* Tabela com resultado de moedas */}
    <table>
      <thead>
        <tr>
          <th scope="col">Moeda</th>
          <th scope="col">Valor Mercado</th>
          <th scope="col">Preço</th>
          <th scope="col">Volume</th>
          <th scope="col">Mudança 48h</th>
        </tr>
      </thead>

      <tbody id="tbody">
        {coins.map((item) => (
          <tr className={styles.tr} key={item.id}>
            <td className={styles.tdLabel} data-label="Moeda">
              <div className={styles.name}>
                <img className="logo"
                  alt="Logo Cripto"
                  src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`}
                />
                <Link to={`/detail/${item.id}`}>
                  <span>{item.name}</span> | {item.symbol}
                </Link>
              </div>
            </td>

            <td className={styles.tdLabel} data-label="Valor de  mercado">
              {item.formatedMarket}
            </td>

            <td className={styles.tdLabel} data-label="Preço">
              {item.formatedPrice}
            </td>

            <td className={styles.tdLabel} data-label="Volume">
              {item.formatedVolume}
            </td>

            <td
              className={
                Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss
              }
              data-label="Mudança 24h"
            >
              <span>{Number(item.changePercent24Hr).toFixed(2)}%</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <button className={styles.buttonMore} onClick={handleGetMore}>
      Carregar mais
    </button>
  </main>
  )
}
