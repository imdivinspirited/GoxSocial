/**
 * Add promotional posts directly to storage
 * This script should be executed in the same context as the server
 */

const { createPost } = require('./storage');

async function addPromotionalPosts() {
  const posts = [
    {
      userId: 1,
      content: "🌴 Excited to announce the launch of GoX Social - the ultimate platform for travel enthusiasts! Connect with travelers worldwide, discover hidden gems, and share your journey. #TravelCommunity #GoXSocial #NewLaunch",
      images: ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"],
      isPublic: true
    },
    {
      userId: 1,
      content: "✈️ Planning your next vacation? Join GoX Social to get personalized travel recommendations and connect with experienced travelers. Save up to 25% on bookings through our partners! #TravelDeals #VacationPlanning #GoXSocial",
      images: ["https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"],
      isPublic: true
    },
    {
      userId: 1,
      content: "📸 Share your travel stories and inspire others! Our new photo-sharing feature lets you showcase your adventures in stunning quality. Tag #GoXMoments to be featured on our weekly spotlight! #TravelPhotography #TravelStories",
      images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"],
      isPublic: true
    },
    {
      userId: 1,
      content: "🔥 Hot deal alert! Premium members get exclusive access to luxury resorts at unbeatable prices. Upgrade your account today and experience travel like never before. #LuxuryTravel #ExclusiveDeals #PremiumPerks",
      images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"],
      isPublic: true
    },
    {
      userId: 1,
      content: "🤝 Calling all travel influencers and bloggers! Partner with GoX Social to reach thousands of travel enthusiasts. Our new creator program offers amazing perks and monetization opportunities. DM for details! #CreatorProgram #TravelInfluencer #Partnership",
      images: ["https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"],
      isPublic: true
    }
  ];

  console.log('Starting to add promotional posts...');
  
  for (const postData of posts) {
    try {
      const newPost = await createPost(postData);
      console.log(`Added post ${newPost.id}: ${postData.content.substring(0, 30)}...`);
    } catch (error) {
      console.error(`Failed to add post: ${error.message}`);
    }
  }
  
  console.log('Promotional posts added successfully!');
}

// Export the function to be used in routes.ts
module.exports = { addPromotionalPosts }; 