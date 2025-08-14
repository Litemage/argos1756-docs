import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// Import robot images directly from the docs folder using the @site alias
// Note: We only include years we have images for in this repo.
import Robot2018 from '@site/docs/robot_doc/Argos_Robots/argos_2018.jpg';
import Robot2019 from '@site/docs/robot_doc/Argos_Robots/Argos_2019.jpeg';
import Robot2020 from '@site/docs/robot_doc/Argos_Robots/Argos_2020.jpeg';
import Robot2016 from '@site/docs/robot_doc/Argos_Robots/2016_robot.jpg';
import Robot2014 from '@site/docs/robot_doc/Argos_Robots/2014_robot.jpg';
import Robot2022 from '@site/docs/robot_doc/Argos_Robots/Argos_2022.jpeg';
import Robot2023 from '@site/docs/robot_doc/Argos_Robots/Argos_2023.png';
import Robot2024 from '@site/docs/robot_doc/Argos_Robots/Argos_2024.jpeg';
import Robot2025 from '@site/docs/robot_doc/Argos_Robots/Argos_2025.jpeg';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const robots = [
  {year: 2014, game: 'AERIAL ASSIST', img: Robot2014},
  {year: 2016, game: 'FIRST STRONGHOLD', img: Robot2016},
    {year: 2018, game: 'FIRST POWER UP', img: Robot2018},
    {year: 2019, game: 'DESTINATION: DEEP SPACE', img: Robot2019},
    {year: 2020, game: 'INFINITE RECHARGE', img: Robot2020},
    // 2021 had no in-person robot; intentionally omitted
    {year: 2022, game: 'RAPID REACT', img: Robot2022},
    {year: 2023, game: 'CHARGED UP', img: Robot2023},
    {year: 2024, game: 'CRESCENDO', img: Robot2024},
    {year: 2025, game: 'REEFSCAPE', img: Robot2025},
  ];
  robots.sort((a,b) => a.year - b.year);
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>


        <section className={styles.timelineSection}>
          <div className={styles.timeline}>
            <div className={styles.timelineList}>
              {robots.map(({year, game, img}) => (
                <div key={year} className={styles.timelineItem} title={`${year} - ${game}`}>
                  <div className={styles.imageWrap}>
                    <img src={img} alt={`Argos Robot ${year} - ${game}`} className={styles.timelineImage} loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
