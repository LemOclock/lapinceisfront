import Style from "./footer.scss";

export default function Footer() {
  return (
    <footer>
      <ul className="linksfooter">
        <li>
          <a href="/contact">Contact</a>
        </li>
        <li>
          <a href="/termsconditions">Conditions générales</a>
        </li>
        <li>
          <a href="/about">A propos</a>
        </li>
      </ul>
      
      <ul className="socialfooter">
        <li>
          <a href="#">
            <img src="https://i.imgur.com/PQcFv6o.png" alt="facebook-icon" />
          </a>
        </li>
        <li>
          <a href="#">
            <img src="https://i.imgur.com/JK6wwYp.png" alt="instagram" />
          </a>
        </li>
        <li>
          <a href="#">
            <img src="https://i.imgur.com/DX9uBtf.png" alt="linkedin" />
          </a>
        </li>
      </ul>
    </footer>
  );
}
