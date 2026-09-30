import React from "react";
import styles from "./Products.module.css";

const products = [
    {
        name: "Cow Ghee",
        category: "Food & Dairy",
        description: "Traditional cow milk ghee from natural dairy practices.",
        icon: "🥛",
    },
    {
        name: "Panchgavya Products",
        category: "Panchgavya",
        description: "Products made using traditional Panchgavya-based practices.",
        icon: "🌿",
    },
    {
        name: "Organic Manure",
        category: "Agriculture",
        description: "Cow-based manure used for natural and sustainable farming.",
        icon: "🌱",
    },
    {
        name: "Cow Dung Dhoop",
        category: "Traditional Products",
        description: "Traditional household products made from cow dung.",
        icon: "🪔",
    },
    {
        name: "Cow Dung Diyas",
        category: "Handmade Products",
        description: "Eco-friendly handmade diyas made from cow dung.",
        icon: "🕯️",
    },
    {
        name: "Natural Soap",
        category: "Personal Care",
        description: "Traditional cow-based personal care products.",
        icon: "🧼",
    },
];

export default function Products() {
    return (
        <main className={styles.productsPage}>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <span className={styles.tag}>PRODUCTS</span>

                    <h1>
                        Explore <span>Cow-Based Products</span>
                    </h1>

                    <p>
                        Discover products related to Panchgavya, dairy, agriculture,
                        traditional practices and rural livelihoods.
                    </p>
                </div>
            </section>

            {/* Categories */}
            <section className={styles.section}>
                <div className={styles.container}>

                    <div className={styles.heading}>
                        <span className={styles.tag}>EXPLORE</span>
                        <h2>Products You Can Discover</h2>
                        <p>
                            Explore different types of products made or inspired by
                            cow-based resources and traditional practices.
                        </p>
                    </div>

                    <div className={styles.grid}>
                        {products.map((product) => (
                            <div className={styles.card} key={product.name}>

                                <div className={styles.icon}>
                                    {product.icon}
                                </div>

                                <span className={styles.category}>
                                    {product.category}
                                </span>

                                <h3>{product.name}</h3>

                                <p>{product.description}</p>

                                <button className={styles.button}>
                                    Explore →
                                </button>

                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Information */}
            <section className={styles.info}>
                <div className={styles.container}>
                    <h2>Products From Different Sources</h2>

                    <p>
                        Cow-based products may be created by Gaushalas, NGOs,
                        cooperatives, farmers, rural producers, research organizations
                        and private businesses.
                    </p>

                    <p className={styles.note}>
                        Panchgavya Se Panchparivartan is an information platform.
                        Please verify product quality, price and availability from
                        the original seller or organization before purchasing.
                    </p>
                </div>
            </section>

        </main>
    );
}