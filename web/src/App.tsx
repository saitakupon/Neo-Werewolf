import './App.css';
import '@aws-amplify/ui-react/styles.css';

import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Amplify, I18n} from "aws-amplify";
import awsExports from "./aws-exports";
import {vocabularies} from "./assets/i18n/amplify/vocabularies";
import {Authenticator} from "@aws-amplify/ui-react";
import TopPage from "./pages/TopPage";
import CreateRoomPage from "./pages/CreateRoomPage";
import JoinRoomPage from "./pages/JoinRoomPage";
import GamePage from "./pages/GamePage";
import Header from "./components/Header";
import DiscussionPage from "./pages/DiscussionPage";
import ResultPage from "./pages/ResultPage";

Amplify.configure(awsExports);
I18n.putVocabularies(vocabularies);
I18n.setLanguage('ja');

const App: React.FC = () => {
    return (
        <div className="App" style={{touchAction: 'none'}}>
            <Authenticator>
                {({user}) => (
                    <main>
                        <BrowserRouter>
                            <header className={"App-header"}>
                                <Header/>
                            </header>
                            <div className={"App-body"}>
                                <Routes>
                                    <Route path={"/"} element={<TopPage username={user.username}/>}/>
                                    <Route path={"/room/create"} element={<CreateRoomPage/>}/>
                                    <Route path={"/room/join"} element={<JoinRoomPage/>}/>
                                    <Route path={"/game"} element={<GamePage/>}/>
                                    <Route path={"/game/discussion"} element={<DiscussionPage/>}/>
                                    <Route path={"/game/result"} element={<ResultPage/>}/>
                                </Routes>
                            </div>
                            <div className={"App-footer"}/>
                        </BrowserRouter>
                    </main>
                )}
            </Authenticator>
        </div>
    );
}

export default App;
