# 🌐 Lancepoint is an On-Chain Freelance platform built on Solana network

**Contract Address / Program ID:** `AkDSbrdvrnfe558WDZEkGuJUayt8nChyog6bcGr1hVFm`

This program is a fully on-chain freelance job escrow system built using the Anchor framework on Solana. It enables clients to create paid job posts, freelancers to apply, and both parties to securely transact using program-controlled escrow accounts. The goal is to provide a transparent, trustless, and automated system for gig management and payments. 🚀

## 📌 Overview

The Lancepoint allows clients to publish jobs with locked funds held in a PDA-controlled escrow vault. Freelancers can apply with a resume link, and once approved, they submit their work directly through the program. Every action — posting jobs, approving applications, submitting work, releasing payment, or cancelling — is validated and enforced on-chain. This eliminates middlemen and guarantees safety for both clients and freelancers.

## ⚙️ Core Features

Clients can create job posts containing titles, descriptions, budgets, and timelines. The program automatically initializes a pure lamport escrow account for each job, ensuring funds are securely locked. Freelancers can submit applications, and clients can approve, reject, cancel, or complete jobs with clear state transitions. The system also tracks user statistics such as monthly gigs and revenue for both clients and freelancers, enabling on-chain analytics and dashboards. 📊

## 🔒 Secure Escrow & Payments

All funds are held in program-derived escrow accounts, ensuring no human has custody of user money. Payments are released only after client approval of submitted work, using signer-seeded CPI transfers to the freelancer’s wallet. Refunds are automatically executed on job cancellation. Built-in validations, error handling, and strict PDA constraints ensure maximum reliability and safety for all users. 💸



Program/Smart contract Repo:
https://github.com/bellobambo/lp-2-new
