// src/components/sliders/PostsSlider/index.tsx
import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';

interface Post {
    id: number;
    title: string;
    excerpt: string;
    featured_image: string;
}

interface PostsSliderProps {
    attributes: {
        postType: string;
        numberOfPosts: number;
        order: string;
        showFeaturedImage: boolean;
        showTitle: boolean;
        showExcerpt: boolean;
    };
}

export const PostsSlider: React.FC<PostsSliderProps> = ({ attributes }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const { postType, numberOfPosts, order, showFeaturedImage, showTitle, showExcerpt } = attributes;

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/wp-json/wp/v2/${postType}?per_page=${numberOfPosts}&order=${order}&_embed=true`);
                const data = await response.json();
                
                const formattedPosts = data.map((post: any) => ({
                    id: post.id,
                    title: post.title.rendered,
                    excerpt: post.excerpt.rendered,
                    featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
                }));

                setPosts(formattedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
            setLoading(false);
        };

        fetchPosts();
    }, [postType, numberOfPosts, order]);

    if (loading) {
        return (
            <div className="sliderberg-posts-slider-loading">
                <div className="sliderberg-loading-spinner"></div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="sliderberg-posts-slider-empty">
                {__('No posts found. Adjust settings in the sidebar.', 'sliderberg-pro')}
            </div>
        );
    }

    // Render each post as a separate slide that will be handled by the parent slider
    return (
        <>
            {posts.map((post, index) => (
                <div 
                    key={post.id} 
                    className="sliderberg-slide sliderberg-post-slide"
                    data-slide-index={index}
                    data-is-active={index === 0 ? 'true' : 'false'} // Mark first as active
                    style={{
                        display: index === 0 ? 'block' : 'none' // Only show first slide initially
                    }}
                >
                    <div className="sliderberg-slide-content sliderberg-post-content">
                        {showFeaturedImage && post.featured_image && (
                            <div className="sliderberg-post-image">
                                <img src={post.featured_image} alt={post.title} />
                            </div>
                        )}
                        {showTitle && (
                            <h3 className="sliderberg-post-title" dangerouslySetInnerHTML={{ __html: post.title }} />
                        )}
                        {showExcerpt && (
                            <div className="sliderberg-post-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};