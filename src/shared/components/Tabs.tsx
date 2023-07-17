import React, { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import styles from './Tabs.module.css';

export type TabsProps = DivProps & {
  defaultTab: string;
};

interface TabContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
  registerTab: (id: string, name: string) => void;
}

const TabContext = createContext<TabContextType>({
  activeTab: "",
  setActiveTab: () => {
    throw new Error('Value is not presented');
  },
  registerTab: () => {
    throw new Error('Value is not presented');
  },
});

interface TabDef {
  id: string;
  name: string;
}

const Tabs: FC<TabsProps> = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [tabs, setTabs] = useState<TabDef[]>([]);

  const providerValue = useMemo<TabContextType>(() => ({
    activeTab,
    setActiveTab,
    registerTab: (id, name) => setTabs(prev => [...prev, { id, name }]),
  }), [activeTab, setActiveTab, setTabs]);

  return (
    <div className={ styles.tabs }>
      <div className={ styles.tabsHeaders }>
        { tabs.map(tab => (
          <div key={ tab.id } onClick={ () => setActiveTab(tab.id) } className={ styles.tabsHeaderItem }>
            { tab.name }
          </div>
        )) }
      </div>
      <div>
        <TabContext.Provider value={ providerValue }>
          { children }
        </TabContext.Provider>
      </div>
    </div>
  );
};

export type TabProps = { children: ReactNode, tabId: string; tabName: string; };

export const Tab: FC<TabProps> = ({ tabId, tabName, children }, context) => {
  const { activeTab, registerTab } = useContext(TabContext);

  useEffect(() => registerTab(tabId, tabName), []);

  console.log(context);

  return (
    activeTab === tabId ? children : <></>
  );
};

export default Tabs;
