"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { account } from "../appwrite/config";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

const Profile = () => {
    const router = useRouter();
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true); // State to manage loading status

    const deleteSession = async () => {
        try {
            await account.deleteSession('current');
            router.push('/login'); // Redirect after logging out
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await account.getSession('current');
                if (!session) {
                    router.push('/login');
                } else {
                    // Fetch user details only if the session is valid
                    const userDetails = await account.get();
                    setUser(userDetails); // Update the user in context
                    console.log("user:", user);
                }
            } catch (error) {
                console.error('No active session:', error);
                router.push('/login'); // Redirect to login if no session
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        checkSession();
    }, [router, setUser, user]);

    // Loading state handling
    if (loading) {
        return <Loading/>
    }

    return (
        <div className="text-center text-xl bg-white text-black">
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                {user?.email ? (
                    <>
                        <p>Name: {user.name || 'No name available'}</p>
                        <p>Email: {user.email || 'No email available'}</p>
                        <button
                            onClick={deleteSession}
                            className="ml-4 px-4 py-2 bg-blue-500 text-black rounded"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <p className="w-screen h-screen flex justify-center items-center">You are not logged in </p>
                    </>

                )}
            </div>
        </div>
    );
};

export default Profile;