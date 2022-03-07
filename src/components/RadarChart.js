import React from 'react'
import {Radar} from 'react-chartjs-2'
import CharStats from './CharStats';

//https://recharts.org/en-US/guide/getting-started reference
const RadarChart = () => {
    const data = CharStats
    return( 
    <div>
        <Radar
            data={{
                labels: ['Workout', 'Health', 'Study', 'Productivity'],
                datasets: [
                    {
                        label: 'Type',
                    }, 
                    {
                        label: 'Quantity',
                        fill: true,
                        data: data,
                        type: 'radar',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 3,
                        options: {
                            layout: {
                                padding: {
                                    left: 100,
                                }
                            },
                        }
                    }
                
                ],
            }}
            height={400}
            width={600}
            options = {{
                maintainAspectRatio: false,
                
            }}
        />
    </div>
    )
}

export default RadarChart