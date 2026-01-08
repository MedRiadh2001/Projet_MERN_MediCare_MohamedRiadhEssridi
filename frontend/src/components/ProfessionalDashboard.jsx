import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

export default function ProfessionalDashboard() {
    return (
        // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '70vh', padding: '16px' }}>
        //     <PowerBIEmbed
        //         embedConfig={{
        //             type: 'report',   // Type : rapport, dashboard ou tuile
        //             id: 'eyJrIjoiMGI3YWQ2N2MtYzE2YS00MTVlLWI2YjctOWY3Yjg1YzJhYTZjIiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9', // Trouvé dans l'URL Power BI
        //             embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiMGI3YWQ2N2MtYzE2YS00MTVlLWI2YjctOWY3Yjg1YzJhYTZjIiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9', // Trouvé dans l'URL Power BI
        //             settings: {
        //                     panes: {
        //                         filters: { expanded: false, visible: true },
        //                         pageNavigation: { visible: true }
        //                     },
        //                     background: models.BackgroundType.Transparent,
        //                     layoutType: models.LayoutType.Custom,
        //                     customLayout: {
        //                         displayOption: models.DisplayOption.FitToWidth
        //                     }
        //                 }
        //         }}
        //         style={{ width: '100%', maxWidth: '1200px', height: '75vh', border: 0 }}
        //     />

        // </div>

        <div style={{
            width: '100%',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '1300px',
                height: '78vh',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <iframe
                    title="Medicare BI Dashboard"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiMGI3YWQ2N2MtYzE2YS00MTVlLWI2YjctOWY3Yjg1YzJhYTZjIiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9"
                    frameBorder="0"
                    allowFullScreen={true}
                    style={{ display: 'block' }}
                ></iframe>
            </div>
        </div>
    );
};