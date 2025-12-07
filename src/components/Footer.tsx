import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-about">
            <h3 className="footer-title">Hidden Treasures Network</h3>
            <p className="footer-description">
              Hidden Treasures Network is a program of Infinity Aero Club Tampa Bay, Inc., a 501(c)(3) nonprofit
              organization dedicated to inspiring, training, and launching the next generation of aviators and innovators.
            </p>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:info@hiddenttreasuresnetwork.org">info@hiddenttreasuresnetwork.org</a>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <a href="tel:+17573538610">(757) 353-8610</a>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>Wesley Chapel, Florida, USA</span>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="links-list">
              <li><a href="#about">About Us</a></li>
              <li><a href="#partners">Partners</a></li>
              <li><a href="#programs">Programs</a></li>
              <li><a href="#get-involved">Get Involved</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Hidden Treasures Network. All rights reserved.</p>
          <p className="footer-tagline">Empowering the next generation through aviation & STEM</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
