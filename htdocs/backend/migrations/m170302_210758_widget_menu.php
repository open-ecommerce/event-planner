<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210758_widget_menu extends Migration
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
            '{{%widget_menu}}',
            [
                'id'=> $this->primaryKey(11),
                'key'=> $this->string(32)->notNull(),
                'title'=> $this->string(255)->notNull(),
                'items'=> $this->text()->notNull(),
                'status'=> $this->smallInteger(6)->notNull()->defaultValue(0),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%widget_menu}}');
    }
}
