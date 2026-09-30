import React from 'react';
import styles from './Home.module.css';

import HeroSection from './HomeComponents/HeroSection';
import CowRescueHighlight from './HomeComponents/CowRescueHighlight';
import IntroSection from './HomeComponents/IntroSection';
import PanchgavyaSection from './HomeComponents/PanchgavyaSection';
import PanchparivartanSection from './HomeComponents/PanchparivartanSection';
import InnovationSection from './HomeComponents/InnovationSection';
import VisionSection from './HomeComponents/VisionSection';
import FinalCTASection from './HomeComponents/FinalCTASection';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <HeroSection />
      <CowRescueHighlight />
      <IntroSection />
      <PanchgavyaSection />
      <PanchparivartanSection />
      <InnovationSection />
      <VisionSection />
      <FinalCTASection />
    </div>
  );
};

export default Home;