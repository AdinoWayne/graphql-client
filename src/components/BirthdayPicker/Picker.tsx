import className from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import styled from 'styled-components';

interface PickerProps {
    min: number;
    max: number;
    defaultValue: number | null;
    onChange: (value: number) => void;
    formater?: (value: number) => string;
    reversed?: boolean;
}

const Picker = (props: PickerProps) => {
    const { min, max, defaultValue = 0, onChange, formater, reversed } = props;
    const containerRef = useRef<HTMLDivElement>(null);

    const [value, setValue] = useState<number | null>(defaultValue);
    useEffect(() => {
        if(!defaultValue) {

        }
        setValue(defaultValue);
    }, [defaultValue])

    const increase = () => {
        if(value === null) {

        } else {

            if (value < max) {
                setValue(v => v ? v + 1: null);
                onChange && onChange(value + 1)
            }
        }
    }
    const decrease = () => {
        if(value) {
            if (value > min) {
                setValue(v => v ? v - 1: null);
                onChange && onChange(value - 1)
            }
        }
    }

    const onClickValue = (i: number) => {
        setValue(i);
        setShowList(false);
        onChange && onChange(i)
    }

    let list : number[] = [];
    for (let i = min; i <= max; i++) {
        list.push(i);
    }

    const [showList, setShowList] = useState(false);

    useEffect(() => {
        if (showList) {
            const selectedItem = document.querySelector('.picker--option-value.selected');
            if (selectedItem) {
                scrollIntoView(selectedItem, {
                    block: 'center'
                })
            }
        }

        if (containerRef && containerRef.current) {
            const pickerNode = containerRef.current.querySelector('.picker-value');
            const listNode: HTMLElement | null = containerRef.current.querySelector('.picker--list-container');
            if (pickerNode && listNode) {
                const rec = pickerNode.getBoundingClientRect();
                listNode.style.left = rec.x + 'px';
                listNode.style.top = rec.top - 50 + 'px';
            }
        }
    }, [showList])

    let valueDisplay = Number.isNaN(value) ? null : value;

    return (
        <PickerContainer ref={containerRef}>
            <span className="icon-chevron-up picker-button"
                onClick={reversed ? increase : decrease}
            />
            <span className="pointer picker-value"
                onClick={() => setShowList(true)}
            >
                {formater ? (valueDisplay === null) ?  '-' : formater(valueDisplay) :  (valueDisplay || '-')}
            </span>
            <span className="icon-chevron-down picker-button"
                onClick={reversed ? decrease : increase}
            />

            {
                showList && (

                    <div className="picker--backdop"
                        onClick={() => setShowList(false)}
                    >
                        <div className="picker--list-container">
                            {
                                list.map(i => (
                                    <span
                                        className={className("picker--option-value", { selected: i === value })}
                                        data-value={i}
                                        onClick={() => onClickValue(i)}
                                    >{formater ? !isNaN(i) ? formater(i) : '-' : i}</span>
                                ))
                            }
                        </div>
                    </div>
                )
            }

        </PickerContainer>
    )
}

export default Picker;

const PickerContainer = styled.div`
    display: flex;
    position: relative;
    pointer-events: all;
    flex-direction: column;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
    .picker-button {
        cursor: pointer;
        user-select: none;
        color: #ccc;
        &:hover {
            color: var(--text-primary);
            transition: color 0.25s ease-out;
        }
    }

    .picker--backdop {
        position: fixed;
        z-index: 9;
        top:0;
        left: 0;
        right:0;
        bottom: 0;
    }
    .picker--list-container {
        position: absolute;
        height: 250px;
        border: 1px solid #ccc;
        overflow: auto;
        display: flex;
        flex-direction: column;
        background: #fff;
        box-shadow: 0 1px 5px #ccc;
        span {
            padding: 5px 10px;
            font-size: 14px;
            &.selected {
                color: var(--blue);
            }
        }
        span:hover {
            background-color: var(--blue);
            color: #fff;
            cursor: pointer;
        }
    }
`
