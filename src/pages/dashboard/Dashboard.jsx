import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import Alertes from '../../components/alertes/alertes';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

export default function Dashboard() {
    return (
        <>
            <Navbar />
            <main>
                <h2>Bonjour La Pince</h2>
                <h1>Nom du compte</h1>
                <data value='22000'>22000</data>
                <aside>
                    <Alertes />
                </aside>

                {/* <Calendar
                    localizer={localizer}
                    events={[]}
                    views={["week"]}
                    components={{
                        timeGutterHeader: () => null,
                        timeGutter: () => null
                    }}
                /> */}



                <div>
                    <img src="./graphrevenudepense.png" alt="graphrevenudepense" />
                    <p>Revenus : 3400€</p>
                    <p>Dépenses : 2300€</p>
                </div>
                <div>
                    <img src="./budget1.png" alt="budget1" />
                    <p>-1000</p>
                    <img src="./budget2.png" alt="budget2" />
                    <p>-1000</p>
                    <img src="./budget3.png" alt="budget3" />
                    <p>-1000</p>
                </div>


            </main>
            <Footer />
        </>
    )
}