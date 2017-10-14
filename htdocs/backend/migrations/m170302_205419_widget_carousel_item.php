<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205419_widget_carousel_item extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%widget_carousel_item}}',
            [
                'id'=> $this->primaryKey(11),
                'carousel_id'=> $this->integer(11)->notNull(),
                'base_url'=> $this->string(1024)->null()->defaultValue(null),
                'path'=> $this->string(1024)->null()->defaultValue(null),
                'type'=> $this->string(255)->null()->defaultValue(null),
                'url'=> $this->string(1024)->null()->defaultValue(null),
                'caption'=> $this->string(1024)->null()->defaultValue(null),
                'status'=> $this->smallInteger(6)->notNull()->defaultValue(0),
                'order'=> $this->integer(11)->null()->defaultValue(0),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
        $this->createIndex('fk_item_carousel','{{%widget_carousel_item}}','carousel_id',false);
    }

    public function safeDown()
    {
        $this->dropIndex('fk_item_carousel', '{{%widget_carousel_item}}');
        $this->dropTable('{{%widget_carousel_item}}');
    }
}
