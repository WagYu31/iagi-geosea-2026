import { Link } from '@inertiajs/react';

export default function ApplicationLogo(props) {
    return (
        <Link href="/" style={{ textDecoration: 'none' }}>
            <img
                {...props}
                src="/WhatsApp_Image_2025-12-29_at_19.37.46-removebg-preview.png"
                alt="IAGI-GEOSEA Logo"
                style={{ cursor: 'pointer', ...props.style }}
            />
        </Link>
    );
}
