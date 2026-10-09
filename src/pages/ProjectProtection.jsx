import { Link } from "react-router-dom";
import styles from "./ProjectProtection.module.css";

const projects = [
  {
    id: 1,
    number: "01",
    title: "Conservation of Indian Native Gau Breeds",
    shortTitle: "Native Gau Breed Conservation",
    image:
      "https://valonudairyfarm.com/cdn/shop/files/Our_cows_are_healthy.jpg?v=1767591176&width=900",
    description:
      "India has many indigenous cattle breeds with distinct characteristics and a long connection with agriculture and rural life. Conservation projects can help protect these breeds and encourage responsible breeding and care.",
    points: [
      "Protecting indigenous cattle breeds",
      "Promoting responsible breeding practices",
      "Creating awareness about native breeds",
      "Supporting breed documentation and identification",
      "Encouraging healthy and ethical cattle management",
    ],
  },

  {
    id: 2,
    number: "02",
     title: "Supporting Nirashrit (Homeless) Gau",
    shortTitle: "Care for Homeless Cows",
   
    image:
      "https://www.gauvanshakhada.com/img/Gauvansh-Mahotsave.jpg",
    description:
      "Well-managed Gaushalas and NandiShalas can provide a safe environment for cattle that need shelter, food, veterinary attention and protection. The focus should be on animal welfare, hygiene and responsible management.",
    points: [
      "Safe and clean shelter",
      "Nutritious fodder and clean drinking water",
      "Veterinary care and health monitoring",
      "Separate care for injured and weak Gau.",
      "Safe transportation management practices of Nandi and GauVansh.",
    ],
  },

  {
    id: 3,
    number: "03",

     title: "Protection of GauVansh",
    shortTitle: "Gaushala & NandiShala",
   
    image:
      "https://iskcongoshala.in/wp-content/uploads/2022/01/Best-Goshala-1024x680.jpg",
    description:
      "Many homeless or abandoned cattle may face road accidents, hunger, injuries and harsh weather. A structured rescue and rehabilitation approach can help provide immediate care and a safer long-term environment.",
    points: [
      "Rescue and safe relocation",
      "Emergency veterinary support",
      "Food, water and temporary shelter",
      "Identification and responsible rehabilitation",
      "Community participation in Adoption for Nirashrit GauVansh.",
    ],
  },
];

const ProjectProtection = () => {
  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <span className={styles.heroTag}>
            PANCHGAVYA SE PANCHPARIVARTAN
          </span>

          <h1>
            Projects for <span>Gau Seva & Protection</span>
          </h1>

          <p>
            Working towards the conservation, protection and
            responsible care of GauVansh through practical
            community-based initiatives.
          </p>
        </div>
      </section>


      {/* INTRO */}
      <section className={styles.intro}>
        <div className={styles.container}>

          <span className={styles.sectionTag}>
            OUR FOCUS
          </span>

          <h2>
            Three Areas of Action
          </h2>

          <p>
            Our project approach focuses on protecting native
            cattle breeds, strengthening safe shelters and
            supporting cows that are without proper care or shelter.
          </p>

        </div>
      </section>


      {/* THREE PROJECTS */}
      <section className={styles.projects}>
        <div className={styles.container}>

          <div className={styles.projectGrid}>

            {projects.map((project) => (
              <article
                key={project.id}
                className={styles.projectCard}
              >

                <div className={styles.imageWrapper}>

                  <img
                    src={project.image}
                    alt={project.title}
                    className={styles.projectImage}
                    loading="lazy"
                  />

                  <span className={styles.number}>
                    {project.number}
                  </span>

                </div>


                <div className={styles.cardContent}>

                  <span className={styles.cardLabel}>
                    {project.shortTitle}
                  </span>

                  <h3>
                    {project.title}
                  </h3>

                  <p className={styles.description}>
                    {project.description}
                  </p>


                  <div className={styles.helpBox}>

                    <h4>
                      How can this project help?
                    </h4>

                    <ul>
                      {project.points.map((point, index) => (
                        <li key={index}>
                          <span>✓</span>
                          {point}
                        </li>
                      ))}
                    </ul>

                  </div>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>


      {/* HOW IT HELPS COWS */}
      <section className={styles.impact}>
        <div className={styles.container}>

          <div className={styles.impactHeader}>
            <span className={styles.sectionTag}>
              EXPECTED IMPACT
            </span>

            <h2>
              From Protection to a Better Life
            </h2>

            <p>
              Each initiative can contribute to better welfare
              when implemented responsibly, transparently and
              according to the actual needs of animals.
            </p>
          </div>


          <div className={styles.impactGrid}>

            <div className={styles.impactCard}>
              <div className={styles.icon}>🐄</div>
              <h3>Breed Protection</h3>
              <p>
                Helps preserve indigenous cattle diversity and
                encourages responsible conservation.
              </p>
            </div>


            <div className={styles.impactCard}>
              <div className={styles.icon}>🏡</div>
              <h3>Safe Shelter</h3>
              <p>
                Provides animals with protection from extreme
                weather, unsafe surroundings and neglect.
              </p>
            </div>


            <div className={styles.impactCard}>
              <div className={styles.icon}>🩺</div>
              <h3>Better Health</h3>
              <p>
                Regular nutrition, hygiene and veterinary attention
                can improve animal welfare.
              </p>
            </div>


            <div className={styles.impactCard}>
              <div className={styles.icon}>🤝</div>
              <h3>Community Support</h3>
              <p>
                Communities, volunteers and responsible
                organizations can work together for long-term care.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* COMMUNITY ROLE */}
      <section className={styles.community}>
        <div className={styles.container}>

          <div className={styles.communityBox}>

            <div>
              <span className={styles.sectionTag}>
                YOUR ROLE
              </span>

              <h2>
                Cow Protection Needs Community
              </h2>

              <p>
                Conservation and protection become stronger when
                citizens, farmers, Gaushalas, NandiShalas,
                volunteers, NGOs and local communities work together.
              </p>
            </div>


            <div className={styles.actions}>

              <Link
                to="/donation"
                className={styles.primaryBtn}
              >
                Support a Project
              </Link>

              <Link
                to="/contact"
                className={styles.secondaryBtn}
              >
                Join Us
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* DISCLAIMER / RESPONSIBLE APPROACH */}
      <section className={styles.note}>
        <div className={styles.container}>

          <p>
            <strong>Our approach:</strong> Cow protection should
            focus on animal welfare, adequate food and water,
            veterinary care, safe shelter, responsible management
            and long-term rehabilitation.
          </p>

        </div>
      </section>

    </main>
  );
};

export default ProjectProtection;