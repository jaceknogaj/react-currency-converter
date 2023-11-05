import React, { useState } from "react";
import styles from "./Form.module.css";

const Form = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0) {
      setResult("Wprowadź prawidłową kwotę, większą od 0");
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch(
        `https://api.nbp.pl/api/exchangerates/rates/a/${currency}/?format=json`
      );
      const data = await response.json();
      const rate = data.rates?.[0]?.mid;

      if (rate) {
        const convertedAmount = (amount * rate).toFixed(2);
        setResult(`${amount} ${currency} = ${convertedAmount} PLN`);
      } else {
        setResult("Brak danych kursu dla wybranej waluty.");
      }
    } catch (error) {
      setResult("Wystąpił błąd podczas pobierania kursu waluty.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <h3 className={styles.title}>Przelicznik Walut</h3>
        <form onSubmit={handleFormSubmit}>
          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              placeholder="Kwota"
              className={styles.input}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={styles.select}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="CHF">CHF</option>
            </select>
            <button className={styles.btnSubmit} type="submit">
              Przelicz na PLN
            </button>
          </div>
        </form>
        {isLoading ? (
          <div id="loader" className={styles.loader}>
            Pobieranie kursu...
          </div>
        ) : (
          <div id="result" className={styles.result}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
