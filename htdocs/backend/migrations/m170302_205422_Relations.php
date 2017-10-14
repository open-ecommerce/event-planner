<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205422_Relations extends Migration
{

    public function init()
    {
       $this->db = 'db';
       parent::init();
    }

    public function safeUp()
    {
        $this->addForeignKey('fk_article_created_by','{{%article}}','created_by','user',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_article_category_id','{{%article}}','category_id','article_category',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_article_updated_by','{{%article}}','updated_by','user',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_article_attachment_article_id','{{%article_attachment}}','article_id','article',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_article_category_parent_id','{{%article_category}}','parent_id','article_category',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_book_recommendation_id','{{%book}}','recommendation_id','book_recommendation',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_book_updated_by','{{%book}}','updated_by','user',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_book_created_by','{{%book}}','created_by','user',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_book_deals_book_id','{{%book_deals}}','book_id','book',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_book_deals_contact_id','{{%book_deals}}','contact_id','contact',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_book_deals_country_id','{{%book_deals}}','country_id','country',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_contact_contact_type_id','{{%contact}}','contact_type_id','contact_type',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_i18n_message_id','{{%i18n_message}}','id','i18n_source_message',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_rbac_auth_assignment_item_name','{{%rbac_auth_assignment}}','item_name','rbac_auth_item',
'name','CASCADE','CASCADE');
        $this->addForeignKey('fk_rbac_auth_item_rule_name','{{%rbac_auth_item}}','rule_name','rbac_auth_rule',
'name','CASCADE','CASCADE');
        $this->addForeignKey('fk_rbac_auth_item_child_parent','{{%rbac_auth_item_child}}','parent','rbac_auth_item',
'name','CASCADE','CASCADE');
        $this->addForeignKey('fk_rbac_auth_item_child_child','{{%rbac_auth_item_child}}','child','rbac_auth_item',
'name','CASCADE','CASCADE');
        $this->addForeignKey('fk_user_profile_user_id','{{%user_profile}}','user_id','user',
'id','CASCADE','CASCADE');
        $this->addForeignKey('fk_widget_carousel_item_carousel_id','{{%widget_carousel_item}}','carousel_id','widget_carousel',
'id','CASCADE','CASCADE');
    }

    public function safeDown()
    {
     $this->dropForeignKey('fk_article_created_by', '{{%article}}');
     $this->dropForeignKey('fk_article_category_id', '{{%article}}');
     $this->dropForeignKey('fk_article_updated_by', '{{%article}}');
     $this->dropForeignKey('fk_article_attachment_article_id', '{{%article_attachment}}');
     $this->dropForeignKey('fk_article_category_parent_id', '{{%article_category}}');
     $this->dropForeignKey('fk_book_recommendation_id', '{{%book}}');
     $this->dropForeignKey('fk_book_updated_by', '{{%book}}');
     $this->dropForeignKey('fk_book_created_by', '{{%book}}');
     $this->dropForeignKey('fk_book_deals_book_id', '{{%book_deals}}');
     $this->dropForeignKey('fk_book_deals_contact_id', '{{%book_deals}}');
     $this->dropForeignKey('fk_book_deals_country_id', '{{%book_deals}}');
     $this->dropForeignKey('fk_contact_contact_type_id', '{{%contact}}');
     $this->dropForeignKey('fk_i18n_message_id', '{{%i18n_message}}');
     $this->dropForeignKey('fk_rbac_auth_assignment_item_name', '{{%rbac_auth_assignment}}');
     $this->dropForeignKey('fk_rbac_auth_item_rule_name', '{{%rbac_auth_item}}');
     $this->dropForeignKey('fk_rbac_auth_item_child_parent', '{{%rbac_auth_item_child}}');
     $this->dropForeignKey('fk_rbac_auth_item_child_child', '{{%rbac_auth_item_child}}');
     $this->dropForeignKey('fk_user_profile_user_id', '{{%user_profile}}');
     $this->dropForeignKey('fk_widget_carousel_item_carousel_id', '{{%widget_carousel_item}}');
    }
}
