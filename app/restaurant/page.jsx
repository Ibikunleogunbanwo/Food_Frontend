"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Banner from '@/components/Banner';
import DisplayRestaurant from '@/components/displayrestuarant';
import FeaturedDishes from '@/components/Featureddishes';

import { useRouter } from 'next/navigation';

const Restaurantpage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();

  // useEffect(() => {
  //   const storedAuth = localStorage.getItem('auth');
  //   if (storedAuth) {
  //     const parsedAuth = JSON.parse(storedAuth);
  //     setAuth(parsedAuth); // Set auth from localStorage
  //   }
  // }, [setAuth]);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/customer'); // Redirect to login if not authenticated
  //   } else {
  //     const storedUserProfile = localStorage.getItem('userProfile');
  //     if (storedUserProfile) {
  //       setUserProfile(JSON.parse(storedUserProfile)); // Use profile from localStorage
  //     } else {
  //       fetchUserProfile(); // Fetch user profile if not in localStorage
  //     }
  //   }
  // }, [isAuthenticated]);

  // const fetchUserProfile = async () => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${auth.accessToken}`,
  //       },
  //       body: JSON.stringify({
  //         email: auth.email,
  //         access_token: auth.accessToken,
  //         refresh_token: auth.refreshToken,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch user profile');
  //     }

  //     const data = await response.json();
  //     setUserProfile(data.user);

  //     localStorage.setItem('userProfile', JSON.stringify(data.user));
  //   } catch (error) {
  //     console.error('Error fetching user profile:', error);
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      <Navbar user={userProfile} />
      <main className="flex-col">
        <Hero />
        <Banner />
        <FeaturedDishes />
        <DisplayRestaurant />
        <section className="relative py-12 overflow-hidden text-orange-900 bg-orange-100">
          <div className="absolute left-0 w-full h-16 bg-orange-100 rounded-t-full -top-8"></div>
          <div className="relative z-10 max-w-2xl px-4 mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold">Stay Updated</h2>
            <p className="mb-6 text-orange-900">
              Get notified about new restaurants and exclusive offers
            </p>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-6 py-3 text-gray-800 rounded-full focus:ring-2 focus:ring-orange-500"
              />
              <button className="px-8 py-3 text-orange-900 bg-orange-500 rounded-full hover:bg-orange-600">
                Subscribe
              </button>
            </div>
          </div>
          <div className="absolute left-0 w-full h-16 bg-orange-100 rounded-b-full -bottom-8"></div>
        </section>
      </main>
    </div>
  );
};

export default Restaurantpage;
