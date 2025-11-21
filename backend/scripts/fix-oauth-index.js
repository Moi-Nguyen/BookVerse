// ========================================
// Fix OAuth Index - Xóa index cũ và tạo lại
// ========================================

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function fixOAuthIndex() {
    try {
        // Connect to database
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookverse';
        console.log('🔌 Connecting to MongoDB...');
        const conn = await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB:', conn.connection.host);

        // Drop old index
        try {
            await User.collection.dropIndex('oauthProvider_1_oauthId_1');
            console.log('✅ Dropped old index: oauthProvider_1_oauthId_1');
        } catch (error) {
            if (error.code === 27 || error.codeName === 'IndexNotFound') {
                console.log('ℹ️  Old index does not exist, skipping...');
            } else {
                console.log('⚠️  Error dropping index:', error.message);
                // Try to continue anyway
            }
        }

        // Create new partial index
        try {
            await User.collection.createIndex(
                { oauthProvider: 1, oauthId: 1 },
                {
                    unique: true,
                    partialFilterExpression: { oauthProvider: { $ne: null } },
                    name: 'oauthProvider_1_oauthId_1'
                }
            );
            console.log('✅ Created new partial index');
        } catch (error) {
            if (error.code === 85 || error.codeName === 'IndexOptionsConflict') {
                console.log('⚠️  Index already exists with different options');
                console.log('   Trying to drop and recreate...');
                try {
                    await User.collection.dropIndex('oauthProvider_1_oauthId_1');
                    await User.collection.createIndex(
                        { oauthProvider: 1, oauthId: 1 },
                        {
                            unique: true,
                            partialFilterExpression: { oauthProvider: { $ne: null } },
                            name: 'oauthProvider_1_oauthId_1'
                        }
                    );
                    console.log('✅ Recreated index successfully');
                } catch (retryError) {
                    throw retryError;
                }
            } else {
                throw error;
            }
        }

        // List all indexes to verify
        const indexes = await User.collection.indexes();
        console.log('\n📋 Current indexes:');
        indexes.forEach(idx => {
            const info = {
                name: idx.name,
                key: idx.key,
                unique: idx.unique,
                partialFilterExpression: idx.partialFilterExpression
            };
            console.log('  -', JSON.stringify(info, null, 2));
        });

        console.log('\n✅ Index fix completed successfully!');
        console.log('💡 You can now register users without duplicate key error.');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

fixOAuthIndex();

