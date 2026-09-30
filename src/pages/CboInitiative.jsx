import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CboInitiative.module.css';

// Project image asset
import heroArt from '../assets/images/cow7.jpg';

const CboInitiative = () => {
  // 4 Examples of Community Groups
  const examplesList = [
    {
      id: 1,
      title: 'Farmer Groups',
      icon: '🌾',
      desc: 'Local farmers collaborating on shared tools, knowledge, and natural organic inputs.'
    },
    {
      id: 2,
      title: 'Women\'s Groups / SHGs',
      icon: '👩‍🌾',
      desc: 'Local women building economic self-reliance, crafts, micro-savings, and livelihoods.'
    },
    {
      id: 3,
      title: 'Youth Groups',
      icon: '🙋',
      desc: 'Young residents driving local awareness, sports, education, and clean-up drives.'
    },
    {
      id: 4,
      title: 'Local Volunteer Groups',
      icon: '🤝',
      desc: 'Neighbors organizing cattle care, tree planting, health drives, and mutual help.'
    }
  ];

  // 6 Work Areas Cards
  const workAreas = [
    {
      id: 1,
      title: 'Animal Care',
      icon: '🐄',
      desc: 'Help with cattle care, animal welfare and local awareness.'
    },
    {
      id: 2,
      title: 'Farming',
      icon: '🌾',
      desc: 'Share farming knowledge and support better agricultural practices.'
    },
    {
      id: 3,
      title: 'Environment',
      icon: '🌱',
      desc: 'Work together for cleaner and more sustainable surroundings.'
    },
    {
      id: 4,
      title: 'Rural Livelihoods',
      icon: '👩‍🌾',
      desc: 'Explore local opportunities for income and self-employment.'
    },
    {
      id: 5,
      title: 'Women Empowerment',
      icon: '👩',
      desc: 'Support women-led groups, skills and livelihood activities.'
    },
    {
      id: 6,
      title: 'Youth & Volunteering',
      icon: '🙋',
      desc: 'Bring young people together for useful community activities.'
    }
  ];

  // 5 Role Cards
  const rolesList = [
    {
      id: 1,
      title: 'Farmers',
      icon: '👨‍🌾',
      desc: 'Share knowledge and work on local farming activities.'
    },
    {
      id: 2,
      title: 'Women ',
      icon: '👩‍🌾',
      desc: 'Build skills and support livelihood activities.'
    },
    {
      id: 3,
      title: 'Youth',
      icon: '🙋',
      desc: 'Volunteer, organize activities and spread awareness.'
    },
    {
      id: 4,
      title: 'Local Residents',
      icon: '🏠',
      desc: 'Identify local needs and participate in solutions.'
    },
    {
      id: 5,
      title: 'SHGs(Self health Growth)',
      icon: '🤝',
      desc: 'Give time, skills or support to community projects.'
    }
  ];

  // 4 Steps Timeline Flow
  const processSteps = [
    {
      step: '01',
      title: 'Identify',
      desc: 'Find a need in your community.'
    },
    {
      step: '02',
      title: 'Come Together',
      desc: 'Bring interested people together.'
    },
    {
      step: '03',
      title: 'Take Action',
      desc: 'Work together on a practical solution.'
    },
    {
      step: '04',
      title: 'Create Change',
      desc: 'Make your community stronger and more sustainable.'
    }
  ];

  // 4 Ways to Get Involved
  const involvementCards = [
    {
      id: 1,
      icon: '🤝',
      title: 'Join a Group',
      desc: 'Find a local group working on something you care about.',
      btnText: 'Explore Groups →',
      link: '/contact'
    },
    {
      id: 2,
      icon: '🙋',
      title: 'Volunteer',
      desc: 'Give your time, skills or ideas to a community activity.',
      btnText: 'Volunteer →',
      link: '/contact'
    },
    {
      id: 3,
      icon: '🌱',
      title: 'Start an Initiative',
      desc: 'Have an idea that can help your community? Start small and bring people together.',
      btnText: 'Start an Initiative →',
      link: '/contact'
    },
    {
      id: 4,
      icon: '🏘️',
      title: 'Register Your Community',
      desc: 'Have an existing farmer group, women\'s group, youth group or local initiative?',
      btnText: 'Connect Your Community →',
      link: '/contact'
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection} aria-label="Community Organizations Hero">
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span>🌾</span> Grassroots Action • Local Strength
              </div>
              <h1 className={styles.heroTitle}>Community Organizations</h1>
              <p className={styles.heroSubhead}>
                When local people come together, small actions can create meaningful change.
              </p>
              <p className={styles.heroDesc}>
                Community organizations bring farmers, women, youth, volunteers and local residents together to work on issues that matter to their community.
              </p>
            </div>
            <div className={styles.heroImageCard}>
              <img
                src={heroArt}
                alt="Rural community members collaborating in village"
                className={styles.heroImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS A COMMUNITY ORGANIZATION? */}
      <section className={styles.section} aria-label="What Is a Community Organization">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Understanding CBOs</span>
            <h2 className={styles.sectionTitle}>What Is a Community Organization?</h2>
          </div>

          <div className={styles.conceptBox}>
            <p className={styles.conceptText}>
              “A community organization is a group of people from the same village, neighbourhood or local area who come together to solve problems and improve their community.”
            </p>
          </div>

          <div className={styles.examplesGrid}>
            {examplesList.map((ex) => (
              <div key={ex.id} className={styles.exampleCard}>
                <span className={styles.exampleIcon}>{ex.icon}</span>
                <h3 className={styles.exampleTitle}>{ex.title}</h3>
                <p className={styles.exampleDesc}>{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHAT CAN COMMUNITIES WORK ON? */}
      <section className={styles.sectionAlt} aria-label="What Can Communities Work On">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Community Focus</span>
            <h2 className={styles.sectionTitle}>What Can Communities Work On?</h2>
            <p className={styles.sectionSubtitle}>
              Practical local initiatives that create real impact across health, agriculture, and village welfare.
            </p>
          </div>

          <div className={styles.workGrid}>
            {workAreas.map((area) => (
              <div key={area.id} className={styles.workCard}>
                <div className={styles.workIcon}>{area.icon}</div>
                <h3 className={styles.workTitle}>{area.title}</h3>
                <p className={styles.workDesc}>{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHO CAN JOIN? */}
      <section className={styles.section} aria-label="Who Can Join">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Inclusive Participation</span>
            <h2 className={styles.sectionTitle}>Everyone Has a Role</h2>
            <p className={styles.sectionSubtitle}>
              Community participation is open, welcoming, and inclusive for everyone.
            </p>
          </div>

          <div className={styles.rolesGrid}>
            {rolesList.map((role) => (
              <div key={role.id} className={styles.roleCard}>
                <span className={styles.roleIcon}>{role.icon}</span>
                <h3 className={styles.roleTitle}>{role.title}</h3>
                <p className={styles.roleDesc}>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className={styles.sectionAlt} aria-label="How It Works">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Step-by-Step Pathway</span>
            <h2 className={styles.sectionTitle}>From Local Idea to Local Change</h2>
            <p className={styles.sectionSubtitle}>
              A simple 4-step approach to turning community vision into practical results.
            </p>
          </div>

          <div className={styles.timelineWrapper}>
            <div className={styles.timelineConnector}></div>
            {processSteps.map((stepItem, index) => (
              <div key={index} className={styles.timelineStep}>
                <div className={styles.timelineNumber}>{stepItem.step}</div>
                <div>
                  <h3 className={styles.timelineTitle}>{stepItem.title}</h3>
                  <p className={styles.timelineDesc}>{stepItem.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WAYS TO GET INVOLVED */}
      <section className={styles.section} aria-label="Ways to Get Involved">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Take Action</span>
            <h2 className={styles.sectionTitle}>How Can You Get Involved?</h2>
            <p className={styles.sectionSubtitle}>
              Multiple ways to participate, contribute skills, or register your local group.
            </p>
          </div>

          <div className={styles.involvedGrid}>
            {involvementCards.map((item) => (
              <div key={item.id} className={styles.involvedCard}>
                <span className={styles.involvedIcon}>{item.icon}</span>
                <h3 className={styles.involvedTitle}>{item.title}</h3>
                <p className={styles.involvedDesc}>{item.desc}</p>
                <Link to={item.link} className={styles.involvedBtn}>
                  {item.btnText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY STORIES */}
      <section className={styles.sectionAlt} aria-label="Community Stories">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Local Impact</span>
            <h2 className={styles.sectionTitle}>Community Stories</h2>
          </div>

          <div className={styles.storyBox}>
            <p className={styles.storyText}>
              “Community stories will be added as local groups and initiatives become part of the Panchparivartan network.”
            </p>
          </div>
        </div>
      </section>

      {/* 8. PANCHPARIVARTAN COMMUNITY NETWORK */}
      <section className={styles.section} aria-label="Join Community Network">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Growing Network</span>
            <h2 className={styles.sectionTitle}>Join the Panchparivartan Community</h2>
            <p className={styles.sectionSubtitle}>
              Panchgavya Se Panchparivartan aims to connect people, local groups and organizations working towards healthier, stronger and more sustainable communities.
            </p>
          </div>

          <div className={styles.networkGrid}>
            <div className={styles.networkCard}>
              <span className={styles.networkIcon}>📖</span>
              <h3 className={styles.networkPointTitle}>Learn</h3>
              <p className={styles.networkPointDesc}>Discover useful knowledge and sustainable initiatives.</p>
            </div>

            <div className={styles.networkCard}>
              <span className={styles.networkIcon}>🤝</span>
              <h3 className={styles.networkPointTitle}>Connect</h3>
              <p className={styles.networkPointDesc}>Find people and groups working on similar local goals.</p>
            </div>

            <div className={styles.networkCard}>
              <span className={styles.networkIcon}>🌱</span>
              <h3 className={styles.networkPointTitle}>Participate</h3>
              <p className={styles.networkPointDesc}>Take part in activities that can create lasting local change.</p>
            </div>
          </div>

          <div className={styles.networkAction}>
            <Link to="/contact" className={styles.networkBtn}>
              Become Part of the Network →
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOR COMMUNITY GROUPS (FINAL CTA) */}
      <section className={styles.finalCtaSection} aria-label="For Community Groups">
        <div className={styles.container}>
          <h2 className={styles.finalCtaTitle}>Do You Have a Community Group?</h2>
          <p className={styles.finalCtaText}>
            If your group is working for farmers, animal care, rural livelihoods, women, youth, environment or community development, connect with us and become part of the Panchparivartan network.
          </p>
          <Link to="/contact" className={styles.networkBtn}>
            Connect Your Community →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CboInitiative;
