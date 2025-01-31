import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { useTccContext } from '../context/TccContext';

const StatusTag = () => {
    const { tccData } = useTccContext();
    const [isTimelineVisible, setIsTimelineVisible] = useState(false);

    const handleShowTimeline = () => {
        setIsTimelineVisible(true);
    };

    // Mapeamento de cores para os diferentes status
    const statusColors = {
        'Proposta em Análise pelo Orientador': '#FFBF00',
        'Proposta em Análise pelo Coordenador': '#FFBF00',
        'TCC em Desenvolvimento': '#FFBF00',
        'Sessão Prévia em Análise pelo Orientador': '#FFBF00',
        'Sessão Prévia em Análise pelo Coordenador': '#FFBF00',
        'Sessão Prévia Agendada': '#FFBF00',
        'Prévia Aprovada': '#FFBF00',
        'Sessão Final em Análise pelo Orientador': '#FFBF00',
        'Sessão Final em Análise pelo Coordenador': '#FFBF00',
        'Sessão Final Agendada': '#FFBF00',
        'TCC em Fase de Ajuste': '#FFBF00',
        'Proposta Recusada pelo Orientador': '#D2222D',
        'Proposta Recusada pelo Coordenador': '#D2222D',
        'Reprovado na Sessão Prévia': '#D2222D',
        'Reprovado na Sessão Final': '#D2222D',
        'TCC Aprovado': '#007000',
        'Status Desconhecido': '#000000'
    };

    const currentStatus = tccData?.status?.[tccData.status.length - 1]?.statusMensagem || 'Status Desconhecido';
    const statusColor = statusColors[currentStatus] || '#000000';

    const statusTimeline = (tccData?.status || []).slice().reverse();

    return (
        <div>
            <Tag
                value={currentStatus}
                style={{ backgroundColor: statusColor, color: '#FFFFFF', cursor: 'pointer' }}
                onClick={handleShowTimeline}
            />
            <Dialog
                header="Timeline do TCC"
                visible={isTimelineVisible}
                style={{ width: '50vw' }}
                onHide={() => setIsTimelineVisible(false)}
            >
                <Timeline 
                    value={statusTimeline} 
                    opposite={(item) => item.statusMensagem} 
                    content={(item) => (
                        <small className="text-color-secondary">
                            {new Date(item.dataStatus).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </small>
                    )}
                />
            </Dialog>
        </div>
    );
};

export default StatusTag;
