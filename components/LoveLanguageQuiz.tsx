"use client";

import React, { useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import UserMenu from './UserMenu';
import PaymentStatus from './PaymentStatus';

interface Question {
  [key: string]: string;
}

const questions: Question[] = [
  {
    en: "When I feel most loved, it's usually when my partner...",
    sw: "Ninapojisikia kupendwa zaidi, mara nyingi mwenzi wangu...",
    zu: "Ngizwa uthando kakhulu uma umlingani wami...",
    xh: "Ndiziva ndithandwa kakhulu xa iqabane lam...",
    tn: "Ke ikutlwa lorato lwa nnete fa molekane wa me a...",
    af: "Ek voel die meeste geliefd wanneer my maat...",
    sn: "Pandinenge ndichinzwa rudo zvakanyanya, kazhinji mudikani wangu ano...",
    luo: "Aparo hera maduong' ahinya ka chunya hera ne...",
    kj: "Ke ikakwar kotab teta nekurenet ne...",
    ke: "Ka ndina uhunza hukuma, ndi kha vhona mufarisi wanga...",
    nd: "Ngizizwa ngithandwa kakhulu uma isithandwa sami...",
  },
  {
    en: "The gesture that makes me feel closest to my partner is...",
    sw: "Kitendo kinachonifanya nihisi karibu zaidi na mwenzi wangu ni...",
    zu: "Isenzo esingenza ngizwe eduze nomlingani wami...",
    xh: "Isenzo endiziva sindikufutshane neqabane lam xa...",
    tn: "Kgato e e nkitlang le molekane wa me ke...",
    af: "Die gebaar wat my die naaste aan my maat laat voel is...",
    sn: "Chiito chinondiswededza pedyo nemudiwa wangu ndi...",
    luo: "Gima timna moromo gi herana e...",
    kj: "Kachitab tugul che kikurenet ak konget ne...",
    ke: "Zwithu zwi itaho ndi vhe tsini na mufarisi wanga ndi...",
    nd: "Isenzo esingenza ngizizwe eduze kwesithandwa sami yiso...",
  },
  {
    en: "I value it most when my partner...",
    sw: "Nathamini zaidi wakati mwenzi wangu...",
    zu: "Ngiyakwazisa kakhulu uma umlingani wami...",
    xh: "Ndiyixabisa kakhulu xa iqabane lam...",
    tn: "Ke lemoga thata fa molekane wa me a...",
    af: "Ek waardeer dit die meeste wanneer my maat...",
    sn: "Ndinokoshesa zvakanyanya kana mudikani wangu...",
    luo: "Aparo ahinya ka herana waga...",
    kj: "Kikurenet ne tipik chep bichu kora...",
    ke: "Ndi funesa lungano lune mufarisi anga a ita...",
    nd: "Ngiyakwazisa kakhulu uma isithandwa sami...",
  },
];

const loveLanguageExplanations: { [key: string]: string } = {
  en: "Thank you! Based on your answers, you're learning to better understand how you receive love. Your love language might be Words of Affirmation, Acts of Service, Quality Time, Receiving Gifts, or Physical Touch.",
  sw: "Asante! Majibu yako yanaonyesha kuwa unajifunza kuelewa lugha yako ya mapenzi. Inaweza kuwa Maneno ya Thibitisho, Matendo ya Huduma, Muda wa Ubora, Zawadi au Kuguswa kwa Mwili.",
  zu: "Ngiyabonga! Iimpendulo zakho zibonisa ukuthi uyazama ukuqonda ulimi lwakho lothando.",
  xh: "Enkosi! Iimpendulo zakho zibonisa ukuba uzama ukuqonda indlela othanda ngayo ukufumana uthando.",
  tn: "Re a leboga! Dikgopolo tsa gago di bontsha gore o leka go tlhaloganya puo ya lorato ya gago.",
  af: "Dankie! Jou antwoorde wys dat jy besig is om jou liefdestaal beter te verstaan.",
  sn: "Ndatenda! Mhinduro dzako dzinoratidza kuti uri kudzidza kunzwisisa mutauro werudo wako.",
  luo: "Erokamano! Timbe imi one ni itiyogo neno kaka iloso hera maru.",
  kj: "Kop cholin! Tugul che kikurenet ne nyo kora kenyis koit ne rureet.",
  ke: "Ro livhuwa! Zwithu zwau zwi sumbedza uri u khou guda u vhona uri wa funwa hani.",
  nd: "Siyabonga! Izimpendulo zakho zikhombisa ukuthi uzama ukuqonda ulimi lwakho lothando.",
};

export default function LoveLanguageQuiz() {
  const [language, setLanguage] = useState("en");
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user } = useAuth();

  const handleAnswerChange = (index: number, answer: string) => {
    const updated = [...answers];
    updated[index] = answer;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    // Save quiz results to localStorage for Love Doctor personalization
    const quizSummary = answers.join('. ');
    localStorage.setItem('quizResults', quizSummary);
    setSubmitted(true);
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const handleGoToLoveDoctor = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    window.location.href = "/love-doctor";
  };

  const handleGenerateLoveNote = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-pink-50 text-gray-900 px-4 py-6">
      <PaymentStatus />
      
      <div className="max-w-md mx-auto">
        {/* Header with User Menu */}
        <div className="flex justify-between items-center mb-6">
          <div></div> {/* Spacer */}
          <h2 className="text-2xl font-bold text-center">
            💖 Discover Your Love Language
          </h2>
          <UserMenu />
        </div>

        <label htmlFor="language-select" className="block text-pink-700 font-medium mb-2">
          Select Language:
        </label>
        <select
          id="language-select"
          className="w-full mb-4 p-2 border border-pink-300 rounded-lg"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="sw">Swahili</option>
          <option value="zu">Zulu</option>
          <option value="xh">Xhosa</option>
          <option value="tn">Tswana</option>
          <option value="af">Afrikaans</option>
          <option value="sn">Shona</option>
          <option value="luo">Dholuo (Luo)</option>
          <option value="kj">Kalenjin</option>
          <option value="ke">Tshivenda</option>
          <option value="nd">Ndebele</option>
        </select>

        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">{q[language]}</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
              type="text"
              value={answers[index] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder="Type your answer here"
              title="Answer input"
            />
          </div>
        ))}

        {!submitted ? (
          <button
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-lg mt-4 transition-colors"
            onClick={handleSubmit}
          >
            Submit Quiz
          </button>
        ) : (
          <div className="mt-6 bg-green-100 border border-green-300 text-green-800 text-sm text-center rounded-lg p-4">
            <p className="font-semibold mb-4">
              💌 {loveLanguageExplanations[language]}
            </p>
            <div className="space-y-2">
              <button
                onClick={handleGoToLoveDoctor}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors w-full"
              >
                💬 Chat with Love Doctor
              </button>
              <button
                onClick={handleGenerateLoveNote}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors w-full"
              >
                💝 Generate a Love Note
              </button>
              <button
                onClick={handleBackToHome}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors w-full"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm font-medium">🎁 Sign up and get R5 free credits!</p>
            <p className="text-blue-700 text-xs mt-1">
              Create an account to access Love Doctor coaching and generate love notes.
            </p>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </div>
  );
}

