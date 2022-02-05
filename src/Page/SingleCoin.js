import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

// REDUX
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  loadingSingleCoin,
  setSingleCoin,
} from "../redux/actions/SingleCoinAction";

// STYLE AND UTILS
import { SingleCoinWrapper } from "../styles/SingleCoin.style";
import { currencyConverter } from "../utils/helps";
import { useState } from "react";
import { SingleHeader } from "../styles/SingleHeader";

const SingleCoin = () => {
  const [isKorean, setKorean] = useState(true);

  const { id: coinID } = useParams();
  const dispatch = useDispatch();
  const { singleItem, loading } = useSelector((state) => state.singleCoin);

  const getSingleData = async () => {
    dispatch(loadingSingleCoin());
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinID}`
      );
      const {
        name,
        symbol,
        description,
        categories,
        image,
        last_updated,
        market_data,
        market_cap_rank,
        links,
      } = await response.json();
      dispatch(
        setSingleCoin({
          name,
          description,
          symbol,
          categories,
          image,
          last_updated,
          market_data,
          market_cap_rank,
          links,
        })
      );
    } catch {
      dispatch();
    }
  };

  useEffect(() => {
    getSingleData();
  }, [coinID]);

  if (loading) {
    return <h1>LOADING .....</h1>;
  }

  // DESTRUCTURING
  const {
    name,
    symbol,
    description,
    categories,
    image: { small: coinLogo },
    last_updated,
    market_cap_rank,
    market_data,
    links,
  } = singleItem;
  const {
    homepage,
    repos_url: { github, bitbucket },
  } = links;
  const {
    current_price: { krw: currentPrice },
    price_change_percentage_24h,
    ath: { krw: allth },
    atl: { krw: alltl },
    ath_date: { krw: highDate },
    atl_date: { krw: lowDate },
    market_cap: { krw: marketCap },
    total_supply,
  } = market_data;

  return (
    <SingleCoinWrapper>
      {/* HEADER */}
      <SingleHeader className="single__header">
        <div className="single__logo">
          <img className="single__image" src={coinLogo} alt={name} />
          <h4 className="single__coin">
            {name.toUpperCase()} / {symbol.toUpperCase()}
          </h4>
        </div>

        <h1>{currentPrice.toLocaleString()} 원</h1>
        <h1 className={price_change_percentage_24h > 0 ? "bull" : "bearish"}>
          {price_change_percentage_24h.toFixed(2)}%
        </h1>

        <p>{last_updated}</p>
      </SingleHeader>

      <hr />
      <div className="hashtags">
        {categories.map((item) => {
          return <li key={item}>#{item}</li>;
        })}
      </div>

      {/* MAIN */}
      {/* MAIN */}
      <main>
        <div className="box">
          <div className="box__btn">
            <button onClick={() => setKorean(false)}>EN</button>
            <button onClick={() => setKorean(true)}>한국어</button>
          </div>
          <h4
            dangerouslySetInnerHTML={{
              __html: isKorean ? description.ko : description.en,
            }}
          />
        </div>

        <div className="main">
          <h3>{name} 정보</h3>
          <div>
            홈페이지 :
            <a target={"_blank"} rel="noreferrer" href={homepage}>
              {homepage}
            </a>
          </div>

          <ul>
            {github.length > 0 && <h1>github</h1>}
            {github.length > 0 &&
              github.map((item) => {
                return <a style={{display:"block"}} target={"_blank"} href={item} rel="noreferrer"  key={item}>{item}</a>;
              })}
            {bitbucket.length > 0 && <h1>bitbucket</h1>}
            {bitbucket.length > 0
              ? bitbucket.map((item) => {
                  return <li key={item}>{item}</li>;
                })
              : null}
          </ul>

          <p>시가총액 순위 : {market_cap_rank}</p>

          <div>
          <h1>현재 가격 :{currentPrice.toLocaleString()} 원</h1>
          <h3>최고가 : {allth.toLocaleString()}원</h3>
          <h3>최고 일시 : {highDate}</h3>
          <h3>최저가 : {alltl.toLocaleString()}원</h3>
          <h3>최저 일시 : {lowDate}</h3>

          <h3>시가 총액 : {currencyConverter(marketCap)}원</h3>
          <h3>
            총 발행량 : {total_supply ? total_supply.toLocaleString() : "00"}{" "}
            코인
          </h3>
        </div>
        </div>
      </main>

      <hr />
    </SingleCoinWrapper>
  );
};

export default SingleCoin;
