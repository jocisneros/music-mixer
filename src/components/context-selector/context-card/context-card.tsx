// context-card.tsx

import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import Image from 'react-bootstrap/Image';
import { useContextCardStyles, useContextCardCreditStyles } from './context-card.styles';
import { ContextCardProps, ContextCardCreditProps, ContextCardInnerProps, DraggableContextCardProps } from "./context-card.types";
import React, { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { generateRandomString } from '../../../common/functions';


const ContextCardCredit: FC<ContextCardCreditProps> = ({ 
    contextName,
    contextOwner,
    style,
}) => {
    const styles = useContextCardCreditStyles();
    return (
        <div style={style}>
            <p style={styles.contextNameText}>{
                contextName.length > 50
                    ? contextName.slice(0, 43) + '...'
                    : contextName
            }</p>
            <div style={styles.contextCreditContainer}>
                {contextOwner.images && 
                    <Image
                        src={contextOwner.images[0].url}
                        roundedCircle
                        style={styles.ownerAvatar}
                    />
                }
                <div>
                    {contextOwner.type === 'user'
                        ? contextOwner.display_name
                        : contextOwner.name
                    }
                </div>
            </div>
        </div>
    );
}

const ContextCardInner: FC<ContextCardInnerProps> = ({
    context,
    contextOwner,
}) => {
    const styles = useContextCardStyles();

    return (
        <div style={{display: 'flex', alignContent: 'center'}}>
            <Image
                src={context.images[0].url}
                style={styles.contextArt}
            />
            <ContextCardCredit
                contextName={context.name}
                contextOwner={contextOwner}
                style={styles.contextCredit}
            />
        </div>
    );
}

export const ContextCard: FC<ContextCardProps> = ({
    context,
    contextOwner,
    cardColor,
}) => {
    const styles = useContextCardStyles();

    return (
        <Card style={styles.card(cardColor)}>
            <ContextCardInner
                context={context}
                contextOwner={contextOwner}
            />
        </Card>
    );
};

export const DraggableContextCard: FC<DraggableContextCardProps> = ({
    context,
    contextOwner,
    cardColor,
    index,
}) => {
    const styles = useContextCardStyles();
    const id = context.id + '-' + index;

    return (
        <Draggable draggableId={id} key={id} index={index}>
            {(provided) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{...styles.card(cardColor), ...provided.draggableProps.style}}
                >
                    <ContextCardInner
                        context={context}
                        contextOwner={contextOwner}
                    />
                </Card>
            )}
        </Draggable>
    );
}