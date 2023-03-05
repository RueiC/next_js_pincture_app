# Next.js｜Pincture - 圖片分享收藏平台 (Pinterest Remake)

Website Demo - https://next-js-pincture.vercel.app/login

<img width="700" alt="截圖 2023-02-19 23 02 42-min" src="https://user-images.githubusercontent.com/104335056/222036607-ca06dffc-f73f-4b12-800e-4221de3d07b7.png">

【專案目的】
1. 學習「Pinterest」功能的實作 (Pinterest clone)
2. 學習運用Next.js來完成SSR
3. 運用Typescript來解決Javascript型別的問題
4. 學習API的串接
5. 學習CRUD的實作

【收穫】

在這個專案中收穫最多的是
1. 學習現有網頁(Pinterest)的功能實作
2. 學習運用Next.js來完成SSR
3. 如何利用Sanity API query來達成API的請求

【使用技術】

這項專案中使用了：Next.js / Typescript / Formik / TailwindCSS / Sanity / Yup

1. 使用Context API而不使用Zustand或者是Redux的原因在於，在初期規劃專案時，考量到元件的共用狀態尚未到非常複雜，Context API的特性適用其專案規模，且兼具開發速度
2. 使用Tailwind CSS開發，而不使用CSS Module、SASS或Styled Components的主要目的在於，避免掉因為style的命名而花費太多時間，加快專案的開發速度，專注在專案的開發過程
