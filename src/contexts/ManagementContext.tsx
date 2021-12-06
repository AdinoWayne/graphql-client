import React, { createContext, useState } from "react";

export type ManagementsContextState = {
    isFreezing: boolean;
    data: {
        title: string;
        message: string;
        isConfirm?: boolean;
        onCancel: Function;
        onConfirm: Function
    };
    shouldIsOpen: Function;
    setData: Function;
    isOpen: boolean;
    shouldFreezing: Function;
};

const contextDefaultValues: ManagementsContextState = {
    isFreezing: false,
    isOpen: false,
    data: { 
        title: '',
        message: '',
        onCancel: ():void => {},
        onConfirm: ():void => {}
    },
    setData: ():void => {},
    shouldIsOpen: ():void => {},
    shouldFreezing: ():void => {},
};

export const ManagementContext = createContext<ManagementsContextState>(
    contextDefaultValues
);

const ManagementProvider:React.FC = ({ children }) => {

    const [isFreezing, setIsFreezing] = useState<boolean>(contextDefaultValues.isFreezing);
    const [isOpen, setIsOpen] = useState<boolean>(contextDefaultValues.isOpen);
    const [data, setData] = useState<any>(contextDefaultValues.data);

    const shouldFreezing = (value:boolean):void => { setIsFreezing(value)};

    const shouldIsOpen = (isOpen: boolean, value: any):void => {
        if (!!value) {
            setData(value);
        }
        setIsOpen(isOpen);
    };

    return (
        <ManagementContext.Provider
            value={{
                isFreezing,
                shouldFreezing,
                isOpen,
                shouldIsOpen,
                data,
                setData
            }}
        >
        {children}
        </ManagementContext.Provider>
    );
};

export default ManagementProvider;