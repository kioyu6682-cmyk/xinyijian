# Supabase Migration Plan

## Project Overview

The project is a React + TypeScript application for managing personal wardrobe, creating outfits, and sharing with a community. Currently, it uses localStorage for authentication and demo data for wardrobe items. This plan outlines the migration to Supabase as the backend solution.

## Current State

- **Frontend**: React + TypeScript with Context API for state management
- **Authentication**: localStorage-based with demo users
- **Data Storage**: Demo data for wardrobe items, mock data for weather and AI services
- **Community Features**: Hardcoded demo data

## Migration Plan

### 1. Supabase Setup

- [x] Install Supabase dependencies (`@supabase/supabase-js` and `supabase` CLI)
- [x] Create Supabase project in the Supabase dashboard
- [x] Configure environment variables for Supabase URL and anon key
- [x] Set up Supabase client in the application

### 2. Database Schema

- [x] Create initial database schema with the following tables:
  - `users` - User profiles
  - `clothing_items` - Wardrobe items
  - `outfits` - Created outfits
  - `community_posts` - Community posts
  - `bottles` - Clothing exchange items
  - `calendar_entries` - Calendar entries for outfits
  - `comments` - Comments on community posts
- [x] Configure Row Level Security (RLS) for data protection
- [x] Set up triggers for `updated_at` timestamps

### 3. Authentication Migration

- [x] Update AuthContext to use Supabase Authentication
- [x] Implement phone-based authentication (using email as workaround)
- [x] Set up user profile creation on registration
- [x] Update login, register, updateProfile, and logout functions

### 4. Wardrobe Data Migration

- [x] Update useWardrobe hook to use Supabase for CRUD operations
- [x] Implement fetching wardrobe items from Supabase
- [x] Implement adding new wardrobe items
- [x] Implement toggling favorite status
- [x] Implement incrementing wear count

### 5. Remaining Migrations

- [ ] Outfit management (create, read, update, delete)
- [ ] Community posts and comments
- [ ] Calendar integration
- [ ] Bottle (clothing exchange) functionality
- [ ] Weather and AI service integration

## Implementation Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| 1     | Supabase Setup | 1 day |
| 2     | Database Schema | 1 day |
| 3     | Authentication Migration | 1 day |
| 4     | Wardrobe Data Migration | 1 day |
| 5     | Outfit Management | 1 day |
| 6     | Community Features | 1 day |
| 7     | Calendar Integration | 1 day |
| 8     | Bottle Functionality | 1 day |
| 9     | Weather and AI Services | 1 day |
| 10    | Testing and Bug Fixes | 2 days |

## Technical Considerations

### 1. Data Structure

- **User Data**: Store user profiles in the `users` table with UUID as primary key
- **Clothing Items**: Store wardrobe items with user_id foreign key
- **Outfits**: Store outfits with user_id foreign key and references to clothing items
- **Community Posts**: Store posts with author_id foreign key
- **Bottles**: Store clothing exchange items with sender_id and receiver_id foreign keys
- **Calendar Entries**: Store calendar entries with user_id and outfit_id foreign keys
- **Comments**: Store comments with post_id and author_id foreign keys

### 2. Security

- **Row Level Security**: Implement RLS policies to ensure users can only access their own data
- **Authentication**: Use Supabase Authentication for secure user management
- **API Keys**: Store Supabase API keys in environment variables

### 3. Performance

- **Indexing**: Create appropriate indexes for frequently queried fields
- **Pagination**: Implement pagination for large datasets
- **Caching**: Use React caching strategies for frequently accessed data

### 4. Integration

- **Weather API**: Continue using existing weather API integration
- **AI Services**: Continue using existing AI service integration
- **Image Storage**: Use Supabase Storage for user-uploaded images

## Challenges and Solutions

### 1. Phone Authentication

**Challenge**: Supabase requires email for authentication, but the app uses phone numbers.

**Solution**: Use phone number + '@example.com' as the email for Supabase authentication, while storing the actual phone number in the user profile.

### 2. Data Migration

**Challenge**: Migrating existing demo data to Supabase.

**Solution**: Create a one-time migration script to import demo data into Supabase.

### 3. Image Storage

**Challenge**: Storing user-uploaded images.

**Solution**: Use Supabase Storage for image uploads and store the URLs in the database.

### 4. Real-time Updates

**Challenge**: Implementing real-time updates for community features.

**Solution**: Use Supabase Realtime for real-time updates to community posts and comments.

## Next Steps

1. **Complete remaining migrations**:
   - Outfit management
   - Community features
   - Calendar integration
   - Bottle functionality
   - Weather and AI services

2. **Testing**:
   - Unit tests for Supabase integration
   - End-to-end tests for user flows
   - Performance testing

3. **Deployment**:
   - Set up production Supabase project
   - Configure environment variables for production
   - Deploy the application

4. **Monitoring**:
   - Set up logging and monitoring
   - Implement error tracking
   - Monitor performance metrics

## Conclusion

Migrating the backend to Supabase will provide a more robust, secure, and scalable solution for the application. By following this plan, we can ensure a smooth transition while maintaining all existing functionality and adding new features in the future.
