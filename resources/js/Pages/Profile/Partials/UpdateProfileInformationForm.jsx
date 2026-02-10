import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            affiliation: user.affiliation || '',
            whatsapp: user.whatsapp || '',
            category: user.category || '',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="affiliation" value={`Affiliation/Institution${user.role === 'Reviewer' ? ' *' : ''}`} />

                    <TextInput
                        id="affiliation"
                        className="mt-1 block w-full"
                        value={data.affiliation}
                        onChange={(e) => setData('affiliation', e.target.value)}
                        autoComplete="organization"
                        required={user.role === 'Reviewer'}
                    />

                    {user.role === 'Reviewer' && (
                        <p className="mt-1 text-xs text-gray-500">Required for Reviewer accounts</p>
                    )}
                    <InputError className="mt-2" message={errors.affiliation} />
                </div>

                <div>
                    <InputLabel htmlFor="whatsapp" value="WhatsApp/Phone Number" />

                    <TextInput
                        id="whatsapp"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.whatsapp}
                        onChange={(e) => setData('whatsapp', e.target.value)}
                        placeholder="08123456789"
                        autoComplete="tel"
                    />

                    <InputError className="mt-2" message={errors.whatsapp} />
                </div>

                <div>
                    <InputLabel htmlFor="category" value="Participant Category" />

                    <select
                        id="category"
                        className="mt-1 block w-full border-gray-300 focus:border-[#0d7a6a] focus:ring-[#0d7a6a] rounded-xl shadow-sm"
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                    >
                        <option value="">Select Category</option>
                        <option value="Student">Student</option>
                        <option value="Professional">Professional</option>
                        <option value="International Delegate">International Delegate</option>
                    </select>

                    <InputError className="mt-2" message={errors.category} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
