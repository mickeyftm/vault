import React, { createContext, useContext, useState, useMemo } from 'react';

export const NetworksContext = createContext(null);

const NetworksProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const networks = [
    {
      name: 'BSC',
      asset: 'BNB',
      id: '56',
      url: 'https://vault.piggybankone.finance',
    },
    {
      name: 'HECO',
      asset: 'HECO',
      id: '128',
      url: 'https://hecovault.piggybankone.finance',
    },
    {
      name: 'AVALANCHE',
      asset: 'AVAX',
      id: '43114',
      url: 'https://avaxvault.piggybankone.finance',
    },
    {
      name: 'POLYGON',
      asset: 'POLYGON',
      id: '137',
      url: 'https://polygonvault.piggybankone.finance',
    },
    {
      name: 'FANTOM',
      asset: 'FANTOM',
      id: '250',
      url: 'https://fantomvault.piggybankone.finance',
    },
    {
      name: 'HARMONY',
      asset: 'HARMONY',
      id: '1666600000',
      url: 'https://harmonyvault.piggybankone.finance',
    },
  ];

  const currentNetwork = useMemo(
    () => networks.find(network => network.id === process.env.REACT_APP_NETWORK_ID),
    [networks]
  );

  return (
    <NetworksContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        networks,
        currentNetwork,
      }}
    >
      {children}
    </NetworksContext.Provider>
  );
};

export const useNetworks = () => {
  const context = useContext(NetworksContext);

  return context;
};

export default NetworksProvider;
