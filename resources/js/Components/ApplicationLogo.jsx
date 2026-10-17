import { Link } from '@inertiajs/react';

export default function ApplicationLogo(props) {
    return (
        <Link href="/" style={{ textDecoration: 'none' }}>
            <img
                {...props}
                src="/images/iagi-logo.webp"
                alt="IAGI-GEOSEA Logo"
                style={{ cursor: 'pointer', ...props.style }}
            />
        </Link>
    );
}
