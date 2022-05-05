import { Election } from "../../classes/Election";
import { Modal } from 'react-bootstrap';
import { useState } from "react";
import { Party } from "../../classes/Party";
import { Vote } from "../../classes/Vote";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ElectionChartProps {
    election: Election,
    parties: Party[],
    votes: Vote[]
}

const ElectionChart = ({ election, parties, votes }: ElectionChartProps) => {

    const [modalLoaded, setModalLoaded] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setModalLoaded(false);
    }
    const handleShow = () => setShow(true);
    const handleLoad = () => {
        setModalLoaded(true);
    };

    const dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };

    interface DataType {
        partyName: string,
        "Vote Counter": string
    }

    let data: DataType[] = [];

    // generate data
    election.parties.forEach(
        (value) => {
            let partyId: number = value;
            let counter: number = 0;
            votes.forEach(
                (value) => {
                    if(value.electionId === election.id && value.partyId === partyId){
                        counter++;
                    }
                }
            );

            let name: string = parties.find((value) => value.id === partyId)!.name;
            data.push(
                {
                    partyName : name,
                    "Vote Counter" : counter.toString()
                }
            );
        }
    );

    return (
        <>
            <button className="btn btn-sm btn-secondary my-1 mr-2" onClick={handleShow}>Details</button>
            <Modal show={show} onHide={handleClose} onEnter={handleLoad}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {election.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalLoaded &&
                        <div>
                        <ResponsiveContainer minWidth={250} minHeight={300} width={"100%"} height={data.length * 135 + 10}>
                            <BarChart
                            width={1920}
                            layout="vertical"
                            data={data}
                            margin={{
                                top: 5,
                                right: 15,
                                left: 10,
                                bottom: 5,
                            }}
                            barCategoryGap="20%"
                            barGap={2}
                            maxBarSize={10}
                            >
                                <CartesianGrid horizontal={false} strokeWidth={0.5} />
                                <XAxis axisLine={false} type="number" />
                                <YAxis
                                yAxisId={0}
                                dataKey="partyName"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                width={80} 
                                minTickGap={0}
                                />
                                <Bar dataKey="Vote Counter" minPointSize={2} barSize={30} 
                                    animationDuration={1000} label={{ position: "right"}}>
                                {data.map((d, idx) => {
                                    return <Cell key={`cell-${idx}`} fill={dynamicColors()} />;
                                })}
                                </Bar>
                                <Tooltip />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ElectionChart;