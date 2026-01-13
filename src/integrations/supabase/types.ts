export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          link_url: string | null
          store_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          link_url?: string | null
          store_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          link_url?: string | null
          store_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      category_option_groups: {
        Row: {
          category_id: string
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          is_required: boolean | null
          max_selections: number | null
          min_selections: number | null
          name: string
          selection_type: string | null
          store_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          is_required?: boolean | null
          max_selections?: number | null
          min_selections?: number | null
          name: string
          selection_type?: string | null
          store_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          is_required?: boolean | null
          max_selections?: number | null
          min_selections?: number | null
          name?: string
          selection_type?: string | null
          store_id?: string
        }
        Relationships: []
      }
      category_option_items: {
        Row: {
          additional_price: number | null
          created_at: string
          description: string | null
          display_order: number | null
          group_id: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          promotion_end_at: string | null
          promotion_start_at: string | null
          promotional_price: number | null
          store_id: string
        }
        Insert: {
          additional_price?: number | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          group_id: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          promotion_end_at?: string | null
          promotion_start_at?: string | null
          promotional_price?: number | null
          store_id: string
        }
        Update: {
          additional_price?: number | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          group_id?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          promotion_end_at?: string | null
          promotion_start_at?: string | null
          promotional_price?: number | null
          store_id?: string
        }
        Relationships: []
      }
      coupon_usages: {
        Row: {
          coupon_id: string
          created_at: string
          customer_phone: string | null
          discount_applied: number | null
          id: string
          order_id: string | null
          store_id: string
          used_at: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          customer_phone?: string | null
          discount_applied?: number | null
          id?: string
          order_id?: string | null
          store_id: string
          used_at?: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          customer_phone?: string | null
          discount_applied?: number | null
          id?: string
          order_id?: string | null
          store_id?: string
          used_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string | null
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_value: number | null
          store_id: string
          uses_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_type?: string | null
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_value?: number | null
          store_id: string
          uses_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string | null
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_value?: number | null
          store_id?: string
          uses_count?: number | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          last_order_at: string | null
          loyalty_points: number | null
          name: string
          notes: string | null
          phone: string
          store_id: string
          total_orders: number | null
          total_spent: number | null
          updated_at: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_order_at?: string | null
          loyalty_points?: number | null
          name: string
          notes?: string | null
          phone: string
          store_id: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_order_at?: string | null
          loyalty_points?: number | null
          name?: string
          notes?: string | null
          phone?: string
          store_id?: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      delivery_areas: {
        Row: {
          created_at: string
          display_order: number | null
          estimated_time: number | null
          fee: number | null
          id: string
          is_active: boolean | null
          min_order_value: number | null
          name: string
          store_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          estimated_time?: number | null
          fee?: number | null
          id?: string
          is_active?: boolean | null
          min_order_value?: number | null
          name: string
          store_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          estimated_time?: number | null
          fee?: number | null
          id?: string
          is_active?: boolean | null
          min_order_value?: number | null
          name?: string
          store_id?: string
        }
        Relationships: []
      }
      inventory_categories: {
        Row: {
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          store_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          store_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          store_id?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string
          id: string
          movement_type: string
          product_id: string
          quantity: number
          reason: string | null
          store_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          movement_type: string
          product_id: string
          quantity: number
          reason?: string | null
          store_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          movement_type?: string
          product_id?: string
          quantity?: number
          reason?: string | null
          store_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inventory_products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          min_stock_quantity: number | null
          name: string
          price: number
          promotional_price: number | null
          stock_quantity: number | null
          store_id: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_stock_quantity?: number | null
          name: string
          price?: number
          promotional_price?: number | null
          stock_quantity?: number | null
          store_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_stock_quantity?: number | null
          name?: string
          price?: number
          promotional_price?: number | null
          stock_quantity?: number | null
          store_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_settings: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean | null
          min_order_for_points: number | null
          points_per_real: number | null
          points_per_redemption: number | null
          redemption_value: number | null
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          min_order_for_points?: number | null
          points_per_real?: number | null
          points_per_redemption?: number | null
          redemption_value?: number | null
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          min_order_for_points?: number | null
          points_per_real?: number | null
          points_per_redemption?: number | null
          redemption_value?: number | null
          store_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: Json | null
          change_amount: number | null
          coupon_code: string | null
          coupon_discount: number | null
          coupon_id: string | null
          created_at: string
          customer_cpf: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_fee: number | null
          discount: number | null
          id: string
          items: Json
          observations: string | null
          payment_method: string | null
          service_type: string | null
          status: string | null
          store_id: string
          subtotal: number | null
          table_number: string | null
          total: number
          updated_at: string
        }
        Insert: {
          address?: Json | null
          change_amount?: number | null
          coupon_code?: string | null
          coupon_discount?: number | null
          coupon_id?: string | null
          created_at?: string
          customer_cpf?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_fee?: number | null
          discount?: number | null
          id?: string
          items?: Json
          observations?: string | null
          payment_method?: string | null
          service_type?: string | null
          status?: string | null
          store_id: string
          subtotal?: number | null
          table_number?: string | null
          total?: number
          updated_at?: string
        }
        Update: {
          address?: Json | null
          change_amount?: number | null
          coupon_code?: string | null
          coupon_discount?: number | null
          coupon_id?: string | null
          created_at?: string
          customer_cpf?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_fee?: number | null
          discount?: number | null
          id?: string
          items?: Json
          observations?: string | null
          payment_method?: string | null
          service_type?: string | null
          status?: string | null
          store_id?: string
          subtotal?: number | null
          table_number?: string | null
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string
          display_order: number | null
          icon_type: string | null
          id: string
          is_active: boolean | null
          name: string
          store_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon_type?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          store_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon_type?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          store_id?: string
        }
        Relationships: []
      }
      pizza_doughs: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          store_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          store_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          store_id?: string
        }
        Relationships: []
      }
      pizza_edges: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          store_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          store_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          store_id?: string
        }
        Relationships: []
      }
      pizza_flavors: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          ingredients: string | null
          is_active: boolean | null
          is_premium: boolean | null
          name: string
          store_id: string
          surcharge: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string | null
          is_active?: boolean | null
          is_premium?: boolean | null
          name: string
          store_id: string
          surcharge?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string | null
          is_active?: boolean | null
          is_premium?: boolean | null
          name?: string
          store_id?: string
          surcharge?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pizza_size_prices: {
        Row: {
          created_at: string
          flavor_id: string | null
          id: string
          price: number
          size_id: string
          store_id: string
        }
        Insert: {
          created_at?: string
          flavor_id?: string | null
          id?: string
          price?: number
          size_id: string
          store_id: string
        }
        Update: {
          created_at?: string
          flavor_id?: string | null
          id?: string
          price?: number
          size_id?: string
          store_id?: string
        }
        Relationships: []
      }
      pizza_sizes: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          max_flavors: number | null
          name: string
          slices: number | null
          store_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          max_flavors?: number | null
          name: string
          slices?: number | null
          store_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          max_flavors?: number | null
          name?: string
          slices?: number | null
          store_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          promotional_price: number | null
          store_id: string
          updated_at: string
          variations: Json | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price?: number
          promotional_price?: number | null
          store_id: string
          updated_at?: string
          variations?: Json | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          promotional_price?: number | null
          store_id?: string
          updated_at?: string
          variations?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_owner: boolean | null
          name: string | null
          phone: string | null
          store_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_owner?: boolean | null
          name?: string | null
          phone?: string | null
          store_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_owner?: boolean | null
          name?: string | null
          phone?: string | null
          store_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_name: string | null
          id: string
          is_approved: boolean | null
          order_id: string | null
          rating: number
          store_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_name?: string | null
          id?: string
          is_approved?: boolean | null
          order_id?: string | null
          rating: number
          store_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_name?: string | null
          id?: string
          is_approved?: boolean | null
          order_id?: string | null
          rating?: number
          store_id?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          about_us: string | null
          address: string | null
          address_number: string | null
          banner_url: string | null
          cep: string | null
          city: string | null
          close_hour: number | null
          created_at: string
          delivery_fee: number | null
          estimated_delivery_time: number | null
          estimated_prep_time: number | null
          font_family: string | null
          google_maps_link: string | null
          id: string
          instagram: string | null
          is_active: boolean | null
          is_open_override: boolean | null
          logo_url: string | null
          min_order_value: number | null
          name: string
          neighborhood: string | null
          onboarding_completed: boolean | null
          open_hour: number | null
          owner_id: string
          phone: string | null
          pix_key: string | null
          primary_color: string | null
          print_footer_message: string | null
          printer_width: string | null
          printnode_api_key: string | null
          printnode_auto_print: boolean | null
          printnode_max_retries: number | null
          printnode_printer_id: string | null
          schedule: Json | null
          secondary_color: string | null
          sidebar_color: string | null
          slug: string | null
          state: string | null
          uazapi_instance_name: string | null
          uazapi_instance_token: string | null
          updated_at: string
          use_comanda_mode: boolean | null
          whatsapp_name: string | null
          whatsapp_number: string | null
          whatsapp_phone: string | null
          whatsapp_status: string | null
        }
        Insert: {
          about_us?: string | null
          address?: string | null
          address_number?: string | null
          banner_url?: string | null
          cep?: string | null
          city?: string | null
          close_hour?: number | null
          created_at?: string
          delivery_fee?: number | null
          estimated_delivery_time?: number | null
          estimated_prep_time?: number | null
          font_family?: string | null
          google_maps_link?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean | null
          is_open_override?: boolean | null
          logo_url?: string | null
          min_order_value?: number | null
          name: string
          neighborhood?: string | null
          onboarding_completed?: boolean | null
          open_hour?: number | null
          owner_id: string
          phone?: string | null
          pix_key?: string | null
          primary_color?: string | null
          print_footer_message?: string | null
          printer_width?: string | null
          printnode_api_key?: string | null
          printnode_auto_print?: boolean | null
          printnode_max_retries?: number | null
          printnode_printer_id?: string | null
          schedule?: Json | null
          secondary_color?: string | null
          sidebar_color?: string | null
          slug?: string | null
          state?: string | null
          uazapi_instance_name?: string | null
          uazapi_instance_token?: string | null
          updated_at?: string
          use_comanda_mode?: boolean | null
          whatsapp_name?: string | null
          whatsapp_number?: string | null
          whatsapp_phone?: string | null
          whatsapp_status?: string | null
        }
        Update: {
          about_us?: string | null
          address?: string | null
          address_number?: string | null
          banner_url?: string | null
          cep?: string | null
          city?: string | null
          close_hour?: number | null
          created_at?: string
          delivery_fee?: number | null
          estimated_delivery_time?: number | null
          estimated_prep_time?: number | null
          font_family?: string | null
          google_maps_link?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean | null
          is_open_override?: boolean | null
          logo_url?: string | null
          min_order_value?: number | null
          name?: string
          neighborhood?: string | null
          onboarding_completed?: boolean | null
          open_hour?: number | null
          owner_id?: string
          phone?: string | null
          pix_key?: string | null
          primary_color?: string | null
          print_footer_message?: string | null
          printer_width?: string | null
          printnode_api_key?: string | null
          printnode_auto_print?: boolean | null
          printnode_max_retries?: number | null
          printnode_printer_id?: string | null
          schedule?: Json | null
          secondary_color?: string | null
          sidebar_color?: string | null
          slug?: string | null
          state?: string | null
          uazapi_instance_name?: string | null
          uazapi_instance_token?: string | null
          updated_at?: string
          use_comanda_mode?: boolean | null
          whatsapp_name?: string | null
          whatsapp_number?: string | null
          whatsapp_phone?: string | null
          whatsapp_status?: string | null
        }
        Relationships: []
      }
      tables: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string | null
          number: string
          status: string | null
          store_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          number: string
          status?: string | null
          store_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          number?: string
          status?: string | null
          store_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          store_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          store_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          store_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_campaign_recipients: {
        Row: {
          campaign_id: string
          created_at: string
          customer_id: string | null
          customer_name: string | null
          customer_phone: string
          error_message: string | null
          id: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_phone: string
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      whatsapp_campaigns: {
        Row: {
          completed_at: string | null
          created_at: string
          delivered_count: number | null
          failed_count: number | null
          id: string
          message_content: string
          name: string
          scheduled_at: string | null
          sent_count: number | null
          started_at: string | null
          status: string | null
          store_id: string
          total_recipients: number | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          message_content: string
          name: string
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string | null
          store_id: string
          total_recipients?: number | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          message_content?: string
          name?: string
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string | null
          store_id?: string
          total_recipients?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          created_at: string
          direction: string | null
          id: string
          media_url: string | null
          message: string | null
          order_id: string | null
          phone: string
          status: string | null
          store_id: string
        }
        Insert: {
          created_at?: string
          direction?: string | null
          id?: string
          media_url?: string | null
          message?: string | null
          order_id?: string | null
          phone: string
          status?: string | null
          store_id: string
        }
        Update: {
          created_at?: string
          direction?: string | null
          id?: string
          media_url?: string | null
          message?: string | null
          order_id?: string | null
          phone?: string
          status?: string | null
          store_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
