import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const tagsData = [
        { name: 'Frontend', description: 'Client-side development', color: '#61DAFB' },        // React blue
        { name: 'Backend', description: 'Server-side development', color: '#3C873A' },         // Node.js green
        { name: 'JavaScript', description: 'JS-based tech', color: '#F7DF1E' },                // JS yellow
        { name: 'TypeScript', description: 'Typed superset of JavaScript', color: '#3178C6' }, // TypeScript blue
        { name: 'CSS', description: 'Styling and layout', color: '#2965F1' },                  // CSS3 blue
        { name: 'Framework', description: 'Full-featured development platform', color: '#7C3AED' }, // Generic purple
        { name: 'Library', description: 'Reusable code package', color: '#6366F1' },           // Generic indigo
        { name: 'Database', description: 'Data storage layer', color: '#336791' },             // PostgreSQL blue
        { name: 'ORM', description: 'Object-relational mapping tool', color: '#0C344B' },      // Prisma dark blue
        { name: 'UI', description: 'User interface tools and utilities', color: '#38BDF8' },   // Tailwind blue
        { name: 'Tooling', description: 'Build and development tools', color: '#646CFF' },     // Vite purple
        { name: 'API', description: 'Interface for accessing application logic', color: '#E34F26' }, // Express/Node orange-red
    ];


    const tags = await Promise.all(
        tagsData.map((tag) =>
            prisma.tag.upsert({
                where: { name: tag.name },
                update: {},
                create: tag,
            })
        )
    );

    const getTagIds = (...names: string[]) =>
        tags.filter((t) => names.includes(t.name)).map((t) => ({ id: t.id }));

    const techData = [
        {
            name: 'React',
            description: 'A JavaScript library for building user interfaces',
            tagNames: ['Frontend', 'JavaScript', 'Library', 'UI'],
        },
        {
            name: 'Next.js',
            description: 'React framework for production',
            tagNames: ['Frontend', 'JavaScript', 'Framework'],
        },
        {
            name: 'TypeScript',
            description: 'A superset of JavaScript that compiles to plain JavaScript',
            tagNames: ['JavaScript', 'TypeScript', 'Tooling'],
        },
        {
            name: 'Tailwind CSS',
            description: 'Utility-first CSS framework for rapid UI development',
            tagNames: ['CSS', 'Frontend', 'UI'],
        },
        {
            name: 'Node.js',
            description: 'JavaScript runtime built on Chrome\'s V8 engine',
            tagNames: ['Backend', 'JavaScript', 'API'],
        },
        {
            name: 'Express',
            description: 'Minimal and flexible Node.js web application framework',
            tagNames: ['Backend', 'JavaScript', 'Framework', 'API'],
        },
        {
            name: 'Prisma',
            description: 'Next-generation ORM for Node.js and TypeScript',
            tagNames: ['Backend', 'ORM', 'Database', 'TypeScript'],
        },
        {
            name: 'PostgreSQL',
            description: 'A powerful, open source object-relational database system',
            tagNames: ['Database', 'Backend'],
        },
        {
            name: 'Vite',
            description: 'Next Generation Frontend Tooling',
            tagNames: ['Frontend', 'Tooling'],
        },
        {
            name: 'Zod',
            description: 'TypeScript-first schema validation with static type inference',
            tagNames: ['TypeScript', 'Tooling'],
        },
    ];

    for (const tech of techData) {
        const technology = await prisma.technology.upsert({
            where: { name: tech.name },
            update: {},
            create: {
                name: tech.name,
                description: tech.description,
                tags: {
                    connect: getTagIds(...tech.tagNames),
                },
            },
        });
        console.log(`Seeded technology: ${technology.name}`);
    }
}

main()
    .then(() => console.log('🌱 Seeding complete'))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
