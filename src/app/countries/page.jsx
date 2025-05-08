"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Countries.module.css";
import { Pagination } from "antd";

import CountryCard from "../../components/CountryCard";
import CountryModal from "../../components/CountryModal";
import Loading from "../../components/Loading";

const regions = ["africa", "americas", "antarctic", "asia", "europe", "oceania"];

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerpage = 10;

  const fetchCountries = async (region = "") => {
    setIsLoading(true);
    try {
      const url = region
        ? `https://restcountries.com/v3.1/region/${region}`
        : "https://restcountries.com/v3.1/all";
      const response = await axios.get(url);
      setCountries(response.data);
      if (!region) {
        setAllCountries(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar países:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchComCache = async () => {
      const cacheKey = 'countriesData';
      const cache = sessionStorage.getItem(cacheKey);

      if (cache) {
        setAllCountries(JSON.parse(cache));
        return;
      }

      try {
        const resposta = await axios.get('https://restcountries.com/v3.1/all', { headers });
        setAllCountries(resposta.data);
        sessionStorage.setItem(cacheKey, JSON.stringify(resposta.data));
      } catch (error) {
        alert('Erro ao buscar países')
      }
    };

    fetchComCache();
  }, []);

  const resetFilter = () => fetchCountries();

  const startIndex = (currentPage - 1) * itemsPerpage;
  const endIndex = startIndex + itemsPerpage;
  const currentCountries = countries.slice(startIndex, endIndex);

  const handleCardClick = (country) => {
    toast.info(`Você clicou no país: ${country.name.common}`, {});
  };

  return (
    <div className={styles.container}>
      <ToastContainer 
      position="top-right"
      autoClose={7500}
      theme="dark"
      />
      <h1>Lista de Países do Mundo</h1>
      <div>
        {regions.map((region) => (
          <button
            key={region}
            className={styles.button}
            onClick={() => fetchCountries(region)}
          >
            {region.charAt(0).toUpperCase() + region.slice(1)}
          </button>
        ))}
        <button className={styles.buttonReset} onClick={resetFilter}>
          Mostrar Todos
        </button>
      </div>

      <div className={styles.cardContainer}>
        {isLoading ? (
          <Loading />
        ) : (
          currentCountries.map((country, index) => (
            <CountryCard
              key={index}
              country={country}
              onClick={() => setSelectedCountry(country)}
              onCardClick={handleCardClick}
            />
          ))
        )}
      </div>

      <Pagination 
      defaultCurrent={1}
      current={currentPage}
      pageSize={itemsPerpage}
      total={countries.length}
      onChange={(page) => setCurrentPage(page)}
      showSizeChanger={false}
      hideOnSinglePage={true}
      style={{marginTop: "20px", textAlign: "center"}}
      />

      {selectedCountry && (
        <CountryModal
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
